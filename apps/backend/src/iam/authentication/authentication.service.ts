import { Injectable } from "@nestjs/common";

import { RevocationService } from "../revocation/revocation.service";
import { TokenService } from "../token/token.service";
import { IssueTokensDto } from "./dto/issueTokens.dto";
import { RevokeTokensDto } from "./dto/revokeTokens.dto";

@Injectable()
export class AuthenticationService {
	constructor(
		private readonly tokenService: TokenService,
		private readonly revocationService: RevocationService,
	) {}

	async issueTokens(issueTokensDto: IssueTokensDto) {
		const version = await this.revocationService.ensureVersion(
			issueTokensDto.userId,
		);

		const { userId, ...payload } = issueTokensDto;

		const { ...generatedToken } = await this.tokenService.generateTokens(
			issueTokensDto.userId,
			version,
			payload,
		);

		return generatedToken;
	}

	async revokeTokens(revokeTokensDto: RevokeTokensDto) {
		await this.revocationService.revokeUser(revokeTokensDto.userId);
	}
}
