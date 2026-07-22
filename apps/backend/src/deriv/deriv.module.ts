import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CurrencyModule } from "src/currency/currency.module";
import { DatabaseModule } from "src/database/database.module";
import { HttpModule } from "src/http/http.module";
import { IamModule } from "src/iam/iam.module";
import { OrganizationModule } from "src/organization/organization.module";
import { TransactionsModule } from "src/transactions/transactions.module";
import { DerivService } from "./deriv.service";
import { DerivOptionsRestClient } from "./deriv-options-rest-client";
import { DerivOrgPoolService } from "./deriv-org-pool.service";
import derivRestConfig from "./deriv-rest.config";
import { DerivRestClient } from "./deriv-rest-client";

@Module({
	imports: [
		OrganizationModule,
		IamModule,
		DatabaseModule,
		CurrencyModule,
		HttpModule,
		TransactionsModule,
		ConfigModule.forFeature(derivRestConfig),
	],
	exports: [
		DerivOrgPoolService,
		DerivService,
		DerivRestClient,
		DerivOptionsRestClient,
	],
	providers: [
		DerivOrgPoolService,
		DerivService,
		DerivRestClient,
		DerivOptionsRestClient,
	],
})
export class DerivModule {}
