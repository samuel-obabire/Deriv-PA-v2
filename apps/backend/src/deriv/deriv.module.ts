import { Module } from "@nestjs/common";
import { CurrencyModule } from "src/currency/currency.module";
import { DatabaseModule } from "src/database/database.module";
import { IamModule } from "src/iam/iam.module";
import { OrganisationModule } from "src/organisation/organisation.module";
import { DerivService } from "./deriv.service";
import { DerivOrgPoolService } from "./deriv-org-pool.service";

@Module({
	imports: [OrganisationModule, IamModule, DatabaseModule, CurrencyModule],
	exports: [DerivOrgPoolService, DerivService],
	providers: [DerivOrgPoolService, DerivService],
})
export class DerivModule {}
