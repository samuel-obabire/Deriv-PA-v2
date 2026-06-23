import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { WsException } from "@nestjs/websockets";
import { AuthenticatedSocket } from "src/deriv/types";
import { RequirePermission } from "../decorators/permissions.decorator";

@Injectable()
export class WsPermissionsGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const client: AuthenticatedSocket = context.switchToWs().getClient();

		if (!client.data?.permissions) throw new WsException("Not authenticated");

		const requiredPermission = this.reflector.getAllAndOverride(
			RequirePermission,
			[context.getHandler(), context.getClass()],
		);

		if (!requiredPermission) return true;

		return client.data.permissions.includes(requiredPermission);
	}
}
