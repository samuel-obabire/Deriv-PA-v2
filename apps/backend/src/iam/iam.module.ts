import { Module } from "@nestjs/common";
import { AuthenticationModule } from "./authentication/authentication.module";
import { RedisModule } from "./redis/redis.module";
import { RevocationModule } from "./revocation/revocation.module";
import { TokenModule } from "./token/token.module";

@Module({
	imports: [AuthenticationModule, TokenModule, RevocationModule, RedisModule],
	exports: [AuthenticationModule, TokenModule, RevocationModule, RedisModule],
})
export class IamModule {}
