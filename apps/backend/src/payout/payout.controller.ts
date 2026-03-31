import { Body, Controller, Post } from "@nestjs/common";
import { CreatePayoutDto } from "./dto/create-payout.dto";
import { PayoutService } from "./payout.service";

@Controller("payout")
export class WebhookController {
	constructor(private readonly payoutService: PayoutService) {}

	@Post()
	moniepoint(@Body() payoutDto: CreatePayoutDto) {
		return this.payoutService.moniepointPayout(payoutDto);
	}
}
