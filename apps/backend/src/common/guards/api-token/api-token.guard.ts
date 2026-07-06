import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import type { ConfigType } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { IS_PUBLIC_KEY } from "../../decorators/public.decorator";
import apiTokenConfig from "./api-token.config";

@Injectable()
export class ApiTokenGuard implements CanActivate {
	constructor(
		@Inject(apiTokenConfig.KEY)
		private readonly config: ConfigType<typeof apiTokenConfig>,
		private readonly reflector: Reflector,
	) {}

	canActivate(context: ExecutionContext): boolean {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (isPublic) return true;

		const request = context.switchToHttp().getRequest<Request>();
		const authHeader = request.headers.authorization;

		if (!authHeader?.startsWith("Bearer "))
			throw new UnauthorizedException("Missing bearer token");

		const token = authHeader.slice("Bearer ".length);

		if (token !== this.config.token)
			throw new UnauthorizedException("Invalid token");

		return true;
	}
}
