import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { ParserModule } from "src/parser/parser.module";
import { RateModule } from "src/rate/rate.module";
import { WithdrawalRequestController } from "./withdrawal-request.controller";
import { WithdrawalRequestService } from "./withdrawal-request.service";

@Module({
	imports: [RateModule, ParserModule, DatabaseModule],
	controllers: [WithdrawalRequestController],
	providers: [WithdrawalRequestService],
})
export class WithdrawalRequestModule {}
