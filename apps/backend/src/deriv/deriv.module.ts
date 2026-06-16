import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { IamModule } from "src/iam/iam.module";
import { OrganisationModule } from "src/organisation/organisation.module";
import { CurrencyTokenService } from "./currency-token.service";
import { DerivGateway } from "./deriv.gateway";
import { DerivService } from "./deriv.service";
import { DerivOrgPoolService } from "./deriv-org-pool.service";
import { TransactionService } from "./transaction.service";

@Module({
	imports: [OrganisationModule, IamModule, DatabaseModule],
	exports: [DerivGateway, DerivOrgPoolService],
	providers: [
		CurrencyTokenService,
		DerivGateway,
		DerivOrgPoolService,
		DerivService,
		TransactionService,
	],
})
export class DerivModule {}
