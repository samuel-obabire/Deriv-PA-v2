import { Injectable } from "@nestjs/common";
import { withdrawalRequest } from "@repo/db";

import { mul } from "src/common/utils/decimal";
import { DatabaseService } from "src/database/database.service";
import { ParserService } from "src/parser/parser.service";
import { RateService } from "src/rate/rate.service";
import { CreateWithdrawalRequestDto } from "./dto/create-withdrawal-request.dto";

@Injectable()
export class WithdrawalRequestService {
	constructor(
		private readonly databaseService: DatabaseService,
		private readonly rateService: RateService,
		private readonly parserService: ParserService,
	) {}

	async create(createWithdrawalRequestDto: CreateWithdrawalRequestDto) {
		const parsed = this.parserService.derivParser(
			createWithdrawalRequestDto.body.text.body,
		);

		const { amount, cr, name, currency } = parsed;

		const currentRate = await this.rateService.getCurrentRate();

		const amountNgn = mul(currentRate.withdrawal, amount);

		await this.databaseService.client.insert(withdrawalRequest).values({
			amount: amount.toFixed(2),
			amountNgn: amountNgn.toFixed(2),
			currency: currency,
			derivId: cr,
			clientName: name,
		});
	}
}
