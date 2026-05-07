import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthenticatedSocket } from "src/deriv/types";
import { RequirePermission } from "../decorators/permissions.decorator";

@Injectable()
export class PermissionsGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const permission = this.reflector.getAllAndOverride(RequirePermission, [
			context.getHandler(),
			context.getClass(),
		]);

		if (!permission) {
			return true;
		}

		const client: AuthenticatedSocket = context.switchToWs().getClient();
		return client.data.permissions.includes(permission);
	}
}
