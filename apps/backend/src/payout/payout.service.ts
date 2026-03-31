import { Injectable } from "@nestjs/common";
import { MatcherService } from "src/matcher/matcher.service";
import { ParserService } from "src/parser/parser.service";
import { ProcessorService } from "src/processor/processor.service";
import { CreatePayoutDto } from "./dto/create-payout.dto";

@Injectable()
export class PayoutService {
	constructor(
		private readonly parserService: ParserService,
		private readonly matcherService: MatcherService,
		private readonly processorService: ProcessorService,
	) {}

	async moniepointPayout(createPayoutDto: CreatePayoutDto) {
		const parsed = this.parserService.moniepointParser(createPayoutDto.plain);

		const bestMatchingDerivWithdrawal =
			await this.matcherService.findPayoutMatch(parsed);

		if (bestMatchingDerivWithdrawal) {
			await this.processorService.processMatch(
				bestMatchingDerivWithdrawal,
				parsed,
			);

			return;
		}

		await this.processorService.processUnmatched(parsed);
	}
}
