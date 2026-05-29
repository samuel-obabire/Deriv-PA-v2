import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { WsException } from "@nestjs/websockets";
import { tryCatch } from "@repo/utils";
import { AuthenticatedSocket } from "src/deriv/types";
import { TokenService } from "src/iam/authentication/token.service";
import { DecodedJwtAccessToken } from "src/iam/types";
import { RequirePermission } from "../decorators/permissions.decorator";

@Injectable()
export class WsPermissionsGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private readonly tokenService: TokenService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const client: AuthenticatedSocket = context.switchToWs().getClient();
		const accessToken = client.data.accessToken;

		if (!accessToken) throw new WsException("Missing access Token");

		const [payload, jwtError] = await tryCatch(() =>
			this.tokenService.verifyToken<DecodedJwtAccessToken>(accessToken),
		);

		if (jwtError) {
			throw new WsException("Jwt validation Error");
		}

		const requiredPermission = this.reflector.getAllAndOverride(
			RequirePermission,
			[context.getHandler(), context.getClass()],
		);

		if (!requiredPermission) {
			return true;
		}

		return payload.permissions.includes(requiredPermission);
	}
}
