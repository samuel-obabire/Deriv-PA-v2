import { Module } from "@nestjs/common";
import { RedisModule } from "../redis/redis.module";
import { RevocationService } from "./revocation.service";

@Module({
	imports: [RedisModule],
	providers: [RevocationService],
	exports: [RevocationService],
})
export class RevocationModule {}
