import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule as NestJwtModule } from "@nestjs/jwt";
import jwtConfig from "./jwt.config";

@Module({
	imports: [
		NestJwtModule.registerAsync(jwtConfig.asProvider()),
		ConfigModule.forFeature(jwtConfig),
	],
	exports: [NestJwtModule, ConfigModule],
})
export class JwtModule {}
