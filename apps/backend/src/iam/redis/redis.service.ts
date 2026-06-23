import {
	Inject,
	Injectable,
	NotFoundException,
	OnApplicationBootstrap,
	OnApplicationShutdown,
} from "@nestjs/common";
import type { ConfigType } from "@nestjs/config";
import Redis from "ioredis";
import { InvalidatedValueError } from "src/common/exceptions/invalidatedValue.exception";
import redisConfig from "./redis.config";

@Injectable()
export class RedisService
	implements OnApplicationBootstrap, OnApplicationShutdown
{
	constructor(
		@Inject(redisConfig.KEY)
		private config: ConfigType<typeof redisConfig>,
	) {}

	private redisClient: Redis;

	onApplicationBootstrap() {
		this.redisClient = new Redis({
			host: this.config.host,
			port: this.config.port,
			username: this.config.username,
			password: this.config.password,
		});
	}

	onApplicationShutdown(signal?: string) {
		return this.redisClient.quit();
	}

	async insert<T extends number | string>(
		key: string,
		value: T,
		options?: {
			ttlSeconds?: number | null;
			NX?: boolean;
		},
	) {
		if (typeof options.ttlSeconds === "number" && options.NX) {
			await this.redisClient.set(key, value, "EX", options.ttlSeconds, "NX");
		} else if (typeof options.ttlSeconds === "number") {
			await this.redisClient.set(key, value, "EX", options.ttlSeconds);
		} else if (options.NX) {
			await this.redisClient.set(key, value, "NX");
		} else {
			await this.redisClient.set(key, value);
		}
	}

	async get(key: string) {
		const value = await this.redisClient.get(key);

		if (!value) throw new NotFoundException();

		return value;
	}

	async increment(key: string) {
		return this.redisClient.incr(key);
	}

	async validate(storedValue: string, expectedValue: string) {
		if (storedValue !== expectedValue) throw new InvalidatedValueError();
		return storedValue;
	}

	async invalidate(id: string) {
		await this.redisClient.del(id);
	}

	async consume(id: string) {
		return await this.redisClient.getdel(id);
	}

	async getOrSet(key: string, value: string) {
		// try to set only if not exists
		const result = await this.redisClient.set(key, value, "NX");

		// if set succeeded
		if (result === "OK") {
			return value;
		}

		// if key already exists → fetch existing value
		return await this.redisClient.get(key);
	}

	async acquireLock(key: string, value: string, ttlSeconds: number) {
		const result = await this.redisClient.set(
			key,
			value,
			"EX",
			ttlSeconds,
			"NX",
		);

		return result === "OK";
	}

	async setExpiry(key: string, ttlSeconds: number) {
		return await this.redisClient.expire(key, ttlSeconds);
	}

	async checkLockExists(key: string): Promise<boolean> {
		return (await this.redisClient.exists(key)) === 1;
	}
}
