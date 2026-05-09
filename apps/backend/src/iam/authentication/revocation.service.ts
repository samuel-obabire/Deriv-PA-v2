import { Injectable } from "@nestjs/common";
import { RedisService } from "../redis/redis.service";

@Injectable()
export class RevocationService {
	constructor(private readonly redisService: RedisService) {}

	getVersionKey(userId: string) {
		return `user-version:${userId}`;
	}

	async incrementVersion(versionKey: string) {
		await this.redisService.increment(versionKey);
	}

	async getVersion(userId: string) {
		return this.redisService.get(this.getVersionKey(userId));
	}

	async ensureVersion(userId: string) {
		return this.redisService.getOrSet(this.getVersionKey(userId), "1");
	}

	async revokeUser(userId: string) {
		await this.incrementVersion(this.getVersionKey(userId));
	}
}
