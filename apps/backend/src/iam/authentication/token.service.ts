import { Inject, Injectable } from "@nestjs/common";
import type { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { v4 as uuidv4 } from "uuid";
import jwtConfig from "../jwt/jwt.config";

@Injectable()
export class TokenService {
	constructor(
		@Inject(jwtConfig.KEY)
		private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
		private readonly jwtService: JwtService,
	) {}

	async signToken<T>(sub: string, expiresIn: number, payload: T) {
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
		const jti = uuidv4();

		const [accessToken, refreshToken] = await Promise.all([
			this.signToken(sub, this.jwtConfiguration.accessTokenTtl, {
				...payload,
				sub,
				jti,
				version,
			}),
			this.signToken(sub, this.jwtConfiguration.refreshTokenTtl, {
				sub,
				jti,
				version,
			}),
		]);

		return { accessToken, refreshToken, jti };
	}

	async verifyToken<T extends object>(token: string) {
		return this.jwtService.verifyAsync<T>(token, this.jwtConfiguration);
	}
}
