import { Module } from "@nestjs/common";
import { RevocationModule } from "../revocation/revocation.module";
import { TokenModule } from "../token/token.module";
import { AuthenticationService } from "./authentication.service";

@Module({
	imports: [TokenModule, RevocationModule],
	providers: [AuthenticationService],
	exports: [AuthenticationService],
})
export class AuthenticationModule {}
