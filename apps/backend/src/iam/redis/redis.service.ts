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
		if (typeof options.ttlSeconds === "number") {
			await this.redisClient.set(key, value, "EX", options.ttlSeconds);
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

	async validate(id: string, expectedValue: string) {
		const storedValue = await this.redisClient.get(id);
		if (storedValue !== expectedValue) throw new InvalidatedValueError();
		return storedValue;
	}

	async invalidate(id: string) {
		await this.redisClient.del(id);
	}

	async consume(id: string, expectedValue: string) {
		const stored = await this.validate(id, expectedValue);

		await this.invalidate(id);

		return stored;
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
}
