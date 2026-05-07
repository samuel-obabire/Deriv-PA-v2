import { Inject, Injectable } from "@nestjs/common";
import type { ConfigType } from "@nestjs/config";
import jwtConfig from "../jwt/jwt.config";
import { RedisService } from "../redis/redis.service";

@Injectable()
export class SessionService {
	constructor(
		@Inject(jwtConfig.KEY)
		private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
		private readonly redisService: RedisService,
	) {}

	getRefreshJtiKey(jti: string) {
		return `refresh:${jti}`;
	}

	async insertRefreshToken(jti: string, userId: string) {
		await this.redisService.insert(this.getRefreshJtiKey(jti), userId, {
			ttlSeconds: this.jwtConfiguration.refreshTokenTtl,
		});
	}

	async consumeRefreshToken(jti: string, userId: string) {
		return this.redisService.consume(this.getRefreshJtiKey(jti), userId);
	}
}
