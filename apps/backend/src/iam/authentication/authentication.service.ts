import { Injectable } from "@nestjs/common";
import { DecodedJwtRefreshToken } from "../types";
import { IssueTokensDto } from "./dto/issueTokens.dto";
import { RefreshTokensDto } from "./dto/refreshTokens.dto";
import { RevokeTokensDto } from "./dto/revokeTokens.dto";
import { RevocationService } from "./revocation.service";
import { SessionService } from "./session.service";
import { TokenService } from "./token.service";

@Injectable()
export class AuthenticationService {
	constructor(
		private readonly tokenService: TokenService,
		private readonly sessionService: SessionService,
		private readonly revocationService: RevocationService,
	) {}

	async issueTokens(issueTokensDto: IssueTokensDto) {
		const version = await this.revocationService.initializeVersion(
			issueTokensDto.userId,
		);

		const { jti, ...generatedTokens } = await this.tokenService.generateTokens(
			issueTokensDto.userId,
			{
				permissions: issueTokensDto.permissions,
				version,
			},
		);

		await this.sessionService.insertRefreshToken(jti, issueTokensDto.userId);

		return generatedTokens;
	}

	async refreshTokens(refreshTokenDto: RefreshTokensDto) {
		const { refreshToken, payload } = refreshTokenDto;

		const { jti, sub } =
			await this.tokenService.verifyToken<DecodedJwtRefreshToken>(refreshToken);

		await this.sessionService.consumeRefreshToken(jti, sub);

		const version = await this.revocationService.getVersion(sub);

		const { jti: newJti, ...generatedTokens } =
			await this.tokenService.generateTokens(sub, {
				...payload,
				version,
			});

		await this.sessionService.insertRefreshToken(newJti, sub);

		return generatedTokens;
	}

	async revokeTokens(revokeTokensDto: RevokeTokensDto) {
		await this.revocationService.revokeUser(revokeTokensDto.userId);
	}
}
