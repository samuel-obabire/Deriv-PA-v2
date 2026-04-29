import { Logger, UseFilters, UseInterceptors, UsePipes } from "@nestjs/common";
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
import { ZodValidationPipe } from "nestjs-zod";
import { Server, Socket } from "socket.io";
import { WsExceptionFilter } from "src/common/filters/ws-exception/ws-exception.filter";
import { WsInterceptor } from "src/common/interceptors/ws/ws.interceptor";
import { DerivService } from "./deriv.service";
import { DerivOrgPoolService } from "./deriv-org-pool.service";
import { SubscribeBalanceDto } from "./dto/subscribeBalance.dto";
import { TransferFundsDto } from "./dto/transferFunds.dto";

type AuthPayload = {
	organizationId: string;
	userId: string;
	tokenId: string;
};

export interface Client extends Socket {
	data: {
		orgId: string;
		userId: string;
		tokenId: string;
	};
}

@UsePipes(ZodValidationPipe)
@UseInterceptors(WsInterceptor)
@UseFilters(WsExceptionFilter)
@WebSocketGateway({
	cors: {
		credentials: true,

		//todo: env validation and get env from configService
		orgin: "http://localhost:3001",
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
	) {}

	afterInit() {
		this.logger.log("WebSocket server initialized");
	}

	async handleConnection(client: Client) {
		try {
			const auth = client.handshake.auth as Partial<AuthPayload>;

			if (!auth.organizationId || !auth.userId || !auth.tokenId) {
				throw new WsException("Missing auth params");
			}

			client.data = {
				orgId: auth.organizationId,
				userId: auth.userId,
				tokenId: auth.tokenId,
			};

			const member = await this.authenticate(client);

			// Join org room
			client.join(orgTokenKey(auth.organizationId, auth.tokenId));

			this.logger.log(
				`Member [${member.memberId}] connected — org [${auth.organizationId}]`,
			);
		} catch (err) {
			this.logger.warn(`Connection rejected: ${err}`);
			client.disconnect(true);
		}
	}

	async handleDisconnect(client: Client) {
		try {
			const { orgId, userId } = client.data || {};

			this.logger.log(`Member [${userId}] disconnected — org [${orgId}]`);
			if (!orgId) return;

			// Check remaining users in org room
			const room = this.server.sockets.adapter.rooms.get(
				orgTokenKey(client.data.orgId, client.data.tokenId),
			);

			if (!room || room.size === 0) {
				this.pool.cleanOrganisationPool(client.data.orgId);
				this.logger.log(`Cleaned up Deriv socket for org [${orgId}]`);
			}
		} catch (err) {
			this.logger.error(`Disconnect error: ${err}`);
		}
	}

	@SubscribeMessage(DerivSocketEvent.Authorize)
	authorize(@ConnectedSocket() client: Client) {
		return this.derivService.authorize({
			orgId: client.data.orgId,
			tokenId: client.data.tokenId,
		});
	}

	@SubscribeMessage(DerivSocketEvent.SubscribeBalance)
	async subscribeBalance(
		@ConnectedSocket() client: Client,
		@MessageBody() dto: SubscribeBalanceDto,
	) {
		return this.derivService.subscribeBalance(
			client.data.orgId,
			dto,
			client.data.tokenId,
			this.server,
		);
	}

	@SubscribeMessage(DerivSocketEvent.TransferFunds)
	transferFunds(
		@ConnectedSocket() client: Client,
		@MessageBody() dto: TransferFundsDto,
	) {
		return this.derivService.transferFunds(
			client.data.orgId,
			dto,
			client.data.tokenId,
		);
	}

	private async authenticate(client: Client) {
		const payload = {
			sub: client.data.userId,
			orgId: client.data.orgId,
			role: "admin" as const,
		};

		return {
			memberId: payload.sub,
			orgId: payload.orgId,
			role: payload.role,
		};
	}
}
