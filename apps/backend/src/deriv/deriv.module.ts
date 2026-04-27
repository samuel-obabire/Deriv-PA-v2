import { Module } from "@nestjs/common";
import { OrganisationModule } from "src/organisation/organisation.module";
import { DerivGateway } from "./deriv.gateway";
import { DerivService } from "./deriv.service";
import { DerivOrgPoolService } from "./deriv-org-pool.service";

@Module({
	imports: [OrganisationModule],
	providers: [DerivGateway, DerivService, DerivOrgPoolService],
})
export class DerivModule {}
