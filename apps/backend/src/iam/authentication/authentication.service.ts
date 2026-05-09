import { Injectable, UnauthorizedException } from "@nestjs/common";
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
		const version = await this.revocationService.ensureVersion(
			issueTokensDto.userId,
		);

		const { jti, ...generatedTokens } = await this.tokenService.generateTokens(
			issueTokensDto.userId,
			version,
			{ permissions: issueTokensDto.permissions },
		);

		await this.sessionService.insertRefreshToken(jti, issueTokensDto.userId);

		return generatedTokens;
	}

	async refreshTokens(refreshTokenDto: RefreshTokensDto) {
		const { refreshToken, payload } = refreshTokenDto;

		const {
			jti,
			sub,
			version: tokenVersion,
		} = await this.tokenService.verifyToken<DecodedJwtRefreshToken>(
			refreshToken,
		);

		await this.sessionService.consumeRefreshToken(jti, sub);

		const userCurrentTokenVersion =
			await this.revocationService.getVersion(sub);

		if (!userCurrentTokenVersion || userCurrentTokenVersion !== tokenVersion) {
			throw new UnauthorizedException();
		}

		const { jti: newJti, ...generatedTokens } =
			await this.tokenService.generateTokens(sub, userCurrentTokenVersion, {
				...payload,
			});

		await this.sessionService.insertRefreshToken(newJti, sub);

		return generatedTokens;
	}

	async revokeTokens(revokeTokensDto: RevokeTokensDto) {
		await this.revocationService.revokeUser(revokeTokensDto.userId);
	}
}
