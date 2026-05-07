import { Body, Controller, Post } from "@nestjs/common";
import { DerivGateway } from "src/deriv/deriv.gateway";
import { AuthenticationService } from "./authentication.service";
import { IssueTokensDto } from "./dto/issueTokens.dto";
import { RefreshTokensDto } from "./dto/refreshTokens.dto";
import { RevokeTokensDto } from "./dto/revokeTokens.dto";

@Controller("authentication")
export class AuthenticationController {
	constructor(
		private readonly authenticationService: AuthenticationService,
		private readonly derivGateway: DerivGateway,
	) {}

	@Post("issue-tokens")
	issueTokens(@Body() issueTokensDto: IssueTokensDto) {
		return this.authenticationService.issueTokens(issueTokensDto);
	}

	@Post("refresh-tokens")
	refreshToken(@Body() refreshTokenDto: RefreshTokensDto) {
		return this.authenticationService.refreshTokens(refreshTokenDto);
	}

	@Post("revoke-tokens")
	async revokeTokens(@Body() revokeTokensDto: RevokeTokensDto) {
		await this.authenticationService.revokeTokens(revokeTokensDto);
		this.derivGateway.disconnectUser(revokeTokensDto.userId);
	}
}
