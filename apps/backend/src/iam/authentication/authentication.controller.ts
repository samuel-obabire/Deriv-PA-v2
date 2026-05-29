import { Body, Controller, Post } from "@nestjs/common";
import { DerivGateway } from "src/deriv/deriv.gateway";
import { AuthenticationService } from "./authentication.service";
import { IssueTokensDto } from "./dto/issueTokens.dto";
import { RevokeTokensDto } from "./dto/revokeTokens.dto";

@Controller("authentication")
export class AuthenticationController {
	constructor(
		private readonly authenticationService: AuthenticationService,
		private readonly derivGateway: DerivGateway,
	) {}

	@Post("issue-token")
	issueTokens(@Body() issueTokensDto: IssueTokensDto) {
		return this.authenticationService.issueTokens(issueTokensDto);
	}

	@Post("revoke-token")
	async revokeTokens(@Body() revokeTokensDto: RevokeTokensDto) {
		await this.authenticationService.revokeTokens(revokeTokensDto);
		this.derivGateway.disconnectUser(revokeTokensDto.userId);
	}
}
