import {
	Logger,
	UseFilters,
	UseGuards,
	UseInterceptors,
	UsePipes,
} from "@nestjs/common";
import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	WsException,
} from "@nestjs/websockets";
import { DerivSocketEvent, orgTokenKey } from "@repo/deriv";
import { Permissions } from "@repo/utils";
import { ZodValidationPipe } from "nestjs-zod";
import { Server, Socket } from "socket.io";
import { RequirePermission } from "src/common/decorators/permissions.decorator";
import { WsExceptionFilter } from "src/common/filters/ws-exception/ws-exception.filter";
import { PermissionsGuard } from "src/common/guards/permissions.guard";
import { WsInterceptor } from "src/common/interceptors/ws/ws.interceptor";
import { RevocationService } from "src/iam/authentication/revocation.service";
import { TokenService } from "src/iam/authentication/token.service";
import { DecodedJwtAccessToken } from "src/iam/types";
import { DerivService } from "./deriv.service";
import { DerivOrgPoolService } from "./deriv-org-pool.service";
import { SubscribeBalanceDto } from "./dto/subscribeBalance.dto";
import { TransferFundsDto } from "./dto/transferFunds.dto";
import type { AuthenticatedSocket, AuthPayload } from "./types";

@UsePipes(ZodValidationPipe)
@UseInterceptors(WsInterceptor)
@UseFilters(WsExceptionFilter)
@UseGuards(PermissionsGuard)
@WebSocketGateway({
	cors: {
		credentials: true,
		origin: process.env.FRONTEND_URL,
	},
})
export class DerivGateway
	implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
	@WebSocketServer()
	server: Server;

	private readonly logger = new Logger(DerivGateway.name);

	constructor(
		private readonly pool: DerivOrgPoolService,
		private readonly derivService: DerivService,
		private readonly tokenService: TokenService,
		private readonly revocationService: RevocationService,
	) {}

	afterInit() {
		this.logger.log("WebSocket server initialized");
	}

	async handleConnection(socket: Socket) {
		try {
			const authenticatedSocket = (await this.authenticate(
				socket,
			)) as AuthenticatedSocket;

			const { organizationId, tokenId, userId } = authenticatedSocket.data;

			// Join org room to support broadcast/multi-tab connection
			socket.join(orgTokenKey(organizationId, tokenId));

			// join user room key to support revocation
			socket.join(this.getUserRoomKey(userId));

			this.logger.log(`Member [${userId}] connected — org [${organizationId}]`);
		} catch (err) {
			this.logger.warn(`Connection rejected: ${err}`);
			socket.disconnect(true);
		}
	}

	async handleDisconnect(client: AuthenticatedSocket) {
		try {
			const { organizationId, userId } = client.data;

			this.logger.log(
				`Member [${userId}] disconnected — org [${organizationId}]`,
			);
			if (!organizationId) return;

			// Check remaining users in org room
			const room = this.server.sockets.adapter.rooms.get(
				orgTokenKey(client.data.organizationId, client.data.tokenId),
			);

			if (!room || room.size === 0) {
				this.pool.cleanOrganisationPool(client.data.organizationId);
				this.logger.log(`Cleaned up Deriv socket for org [${organizationId}]`);
			}
		} catch (err) {
			this.logger.error(`Disconnect error: ${err}`);
		}
	}

	@RequirePermission(Permissions.READ)
	@SubscribeMessage(DerivSocketEvent.Authorize)
	authorize(@ConnectedSocket() client: AuthenticatedSocket) {
		return this.derivService.authorize({
			orgId: client.data.organizationId,
			tokenId: client.data.tokenId,
		});
	}

	@RequirePermission(Permissions.READ)
	@SubscribeMessage(DerivSocketEvent.Balance)
	async subscribeBalance(
		@ConnectedSocket() client: AuthenticatedSocket,
		@MessageBody() dto: SubscribeBalanceDto,
	) {
		return this.derivService.subscribeBalance(
			client.data.organizationId,
			dto,
			client.data.tokenId,
			this.server,
		);
	}

	@RequirePermission(Permissions.PAYMENTS)
	@SubscribeMessage(DerivSocketEvent.TransferFunds)
	transferFunds(
		@ConnectedSocket() client: AuthenticatedSocket,
		@MessageBody() dto: TransferFundsDto,
	) {
		return this.derivService.transferFunds(
			client.data.organizationId,
			dto,
			client.data.tokenId,
		);
	}

	private async authenticate(socket: Socket) {
		const { accessToken } = socket.handshake.auth as Partial<AuthPayload>;

		if (!accessToken) {
			throw new WsException("Missing auth params");
		}

		const { organizationId, permissions, sub, tokenId, version } =
			await this.tokenService.verifyToken<DecodedJwtAccessToken>(accessToken);

		const userVersion = await this.revocationService.getVersion(sub);

		if (userVersion !== version.toString()) {
			throw new WsException("Access denied");
		}

		socket.data = {
			organizationId,
			userId: sub,
			tokenId,
			permissions,
			accessToken,
		};

		return socket;
	}

	getUserRoomKey(userId: string) {
		return `user:${userId}`;
	}

	disconnectUser(userId: string) {
		this.logger.log(`Revoking sockets for user ${userId}`);

		this.server.to(this.getUserRoomKey(userId)).disconnectSockets(true);
	}
}
