import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { MatcherModule } from "src/matcher/matcher.module";
import { ParserModule } from "src/parser/parser.module";
import { ProcessorModule } from "src/processor/processor.module";
import { WebhookController } from "./payout.controller";
import { PayoutService } from "./payout.service";

@Module({
	imports: [DatabaseModule, ProcessorModule, ParserModule, MatcherModule],
	controllers: [WebhookController],
	providers: [PayoutService],
	exports: [PayoutService],
})
export class PayoutModule {}
