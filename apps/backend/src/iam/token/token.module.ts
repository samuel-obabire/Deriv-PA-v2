import { Module } from "@nestjs/common";
import { JwtModule } from "../jwt/jwt.module";
import { RedisModule } from "../redis/redis.module";
import { TokenService } from "./token.service";

@Module({
	imports: [JwtModule, RedisModule],
	providers: [TokenService],
	exports: [TokenService],
})
export class TokenModule {}
