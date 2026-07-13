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
import { Permissions, WsAuthError } from "@repo/utils";
import { ZodValidationPipe } from "nestjs-zod";
import { Server, Socket } from "socket.io";
import { GLOBAL_PREFIX } from "src/common/constants";
import { RequirePermission } from "src/common/decorators/permissions.decorator";
import { WsExceptionFilter } from "src/common/filters/ws-exception/ws-exception.filter";
import { WsPermissionsGuard } from "src/common/guards/ws-permissions.guard";
import { WsInterceptor } from "src/common/interceptors/ws/ws.interceptor";
import { DerivService } from "src/deriv/deriv.service";
import { DerivOrgPoolService } from "src/deriv/deriv-org-pool.service";
import { ClientNameValidationDto } from "src/deriv/dto/clientNameValidation.dto";
import { StatementDto } from "src/deriv/dto/statement.dto";
import { SubscribeBalanceDto } from "src/deriv/dto/subscribeBalance.dto";
import { TransferFundsDto } from "src/deriv/dto/transferFunds.dto";
import { TransferValidationDto } from "src/deriv/dto/transferValidation.dto";
import type { AuthenticatedSocket, AuthPayload } from "src/deriv/types";
import { RevocationService } from "src/iam/revocation/revocation.service";
import { TokenService } from "src/iam/token/token.service";
import { DecodedJwtAccessToken } from "src/iam/types";
import { TransferQueueService } from "src/transfers/transfer-queue.service";

@UsePipes(ZodValidationPipe)
@UseInterceptors(WsInterceptor)
@UseFilters(WsExceptionFilter)
@UseGuards(WsPermissionsGuard)
@WebSocketGateway({
	cors: {
		credentials: true,
		origin: process.env.FRONTEND_URL,
	},
	namespace: `/${GLOBAL_PREFIX}`,
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
		private readonly transferQueueService: TransferQueueService,
	) {}

	afterInit() {
		// Ensure all clients are authenticated using the middleware before they can send requests
		this.server.use(async (socket, next) => {
			try {
				await this.authenticate(socket);
				next();
			} catch (err) {
				next(new WsException(err instanceof Error ? err : "Invalid"));
			}
		});
		this.logger.log("WebSocket server initialized");
	}

	async handleConnection(socket: AuthenticatedSocket) {
		const { organizationId, tokenId, userId } = socket.data;

		// Join org room to support broadcast/multi-tab connection
		socket.join(orgTokenKey(organizationId, tokenId));

		// join user room key to support revocation
		socket.join(this.getUserRoomKey(userId));

		this.logger.log(`Member [${userId}] connected — org [${organizationId}]`);
	}

	async handleDisconnect(client: AuthenticatedSocket) {
		try {
			const { organizationId, userId } = client.data;

			this.logger.log(
				`Member [${userId}] disconnected — org [${organizationId}]`,
			);

			if (!organizationId) return;
		} catch (err) {
			this.logger.error(`Disconnect error: ${err}`);
		}
	}

	evictIdleOrgConnection(organizationId: string, tokenId: string) {
		const room = this.server.sockets.adapter.rooms.get(
			orgTokenKey(organizationId, tokenId),
		);

		if (!room || room.size === 0) {
			this.pool.evictOrgConnection(organizationId, tokenId);
			this.logger.log(`Cleaned up Deriv socket for org [${organizationId}]`);
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
	@SubscribeMessage(DerivSocketEvent.ValidatePaymentAgentTransfer)
	validatePaymentAgentTransfer(
		@ConnectedSocket() client: AuthenticatedSocket,
		@MessageBody() dto: TransferValidationDto,
	) {
		return this.derivService.validatePaymentAgentTransfer(
			client.data.organizationId,
			dto,
			client.data.tokenId,
		);
	}

	@RequirePermission(Permissions.READ)
	@SubscribeMessage(DerivSocketEvent.ValidateClientName)
	validateClientName(
		@ConnectedSocket() client: AuthenticatedSocket,
		@MessageBody() dto: ClientNameValidationDto,
	) {
		return this.derivService.validateClientName(
			client.data.organizationId,
			dto,
		);
	}

	@RequirePermission(Permissions.PAYMENTS)
	@SubscribeMessage(DerivSocketEvent.TransferFunds)
	transferFunds(
		@ConnectedSocket() client: AuthenticatedSocket,
		@MessageBody() dto: TransferFundsDto,
	) {
		return this.transferQueueService.scheduleTransfer({
			orgId: client.data.organizationId,
			transferFundsDto: dto,
			tokenId: client.data.tokenId,
			userId: client.data.userId,
		});
	}

	@RequirePermission(Permissions.READ)
	@SubscribeMessage(DerivSocketEvent.Statement)
	statement(
		@ConnectedSocket() client: AuthenticatedSocket,
		@MessageBody() dto: StatementDto,
	) {
		return this.derivService.getStatment(
			client.data.organizationId,
			dto,
			client.data.tokenId,
		);
	}

	private async authenticate(socket: Socket) {
		const { accessToken } = socket.handshake.auth as Partial<AuthPayload>;

		if (!accessToken) {
			throw new WsException(WsAuthError.MissingAuthParams);
		}

		const { organizationId, permissions, sub, tokenId, version } =
			await this.tokenService.verifyToken<DecodedJwtAccessToken>(accessToken);

		const userVersion = await this.revocationService.getVersion(sub);

		if (userVersion !== version.toString()) {
			throw new WsException(WsAuthError.AccessDenied);
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
