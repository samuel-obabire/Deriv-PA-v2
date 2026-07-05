import { Module } from "@nestjs/common";
import { DerivModule } from "src/deriv/deriv.module";
import { IamModule } from "src/iam/iam.module";
import { TransfersModule } from "src/transfers/transfers.module";
import { DerivGateway } from "./deriv.gateway";

@Module({
	imports: [DerivModule, IamModule, TransfersModule],
	providers: [DerivGateway],
	exports: [DerivGateway],
})
export class DerivGatewayModule {}
