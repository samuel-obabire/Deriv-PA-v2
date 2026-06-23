import { Inject, Injectable } from "@nestjs/common";
import type { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { WsException } from "@nestjs/websockets";
import { WsAuthError } from "@repo/utils";
import jwtConfig from "../jwt/jwt.config";
import { RedisService } from "../redis/redis.service";

@Injectable()
export class TokenService {
	constructor(
		@Inject(jwtConfig.KEY)
		private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
		private readonly jwtService: JwtService,
		private readonly redisService: RedisService,
	) {}

	private async signToken<T>(sub: string, expiresIn: number, payload: T) {
		return this.jwtService.signAsync(
			{ sub, ...payload },
			{
				audience: this.jwtConfiguration.audience,
				issuer: this.jwtConfiguration.issuer,
				secret: this.jwtConfiguration.secret,
				expiresIn,
			},
		);
	}

	async generateTokens<T extends object>(
		sub: string,
		version: string,
		payload: T,
	) {
		const accessToken = await this.signToken(
			sub,
			this.jwtConfiguration.accessTokenTtl,
			{
				...payload,
				sub,
				version,
			},
		);

		await this.registerToken(accessToken, sub);

		return { accessToken };
	}

	async verifyToken<T extends object>(token: string) {
		const decoded = await this.jwtService.verifyAsync<T>(
			token,
			this.jwtConfiguration,
		);

		await this.consumeToken(token);

		return decoded;
	}

	private async registerToken(token: string, value: string) {
		await this.redisService.insert(token, value, {
			ttlSeconds: this.jwtConfiguration.accessTokenTtl,
			NX: true,
		});
	}

	private async consumeToken(token: string) {
		const stored: string | null = await this.redisService.consume(token);

		if (!stored) {
			throw new WsException(WsAuthError.InvalidToken);
		}
	}
}
