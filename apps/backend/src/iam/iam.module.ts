import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { AuthenticationService } from "./authentication/authentication.service";
import { RevocationService } from "./authentication/revocation.service";
import { SessionService } from "./authentication/session.service";
import { TokenService } from "./authentication/token.service";
import jwtConfig from "./jwt/jwt.config";
import { RedisModule } from "./redis/redis.module";

@Module({
	exports: [
		AuthenticationService,
		RedisModule,
		TokenService,
		RevocationService,
	],
	imports: [
		RedisModule,
		JwtModule.registerAsync(jwtConfig.asProvider()),
		ConfigModule.forFeature(jwtConfig),
	],
	providers: [
		AuthenticationService,
		TokenService,
		SessionService,
		RevocationService,
	],
})
export class IamModule {}
