import { Body, Controller, Post, UseInterceptors } from "@nestjs/common";
import { WebhookAlwaysOkInterceptor } from "src/common/webhook-always-ok/webhook-always-ok.interceptor";
import { CreatePayoutDto } from "./dto/create-payout.dto";
import { PayoutService } from "./payout.service";

@Controller("payout")
export class WebhookController {
	constructor(private readonly payoutService: PayoutService) {}

	@UseInterceptors(WebhookAlwaysOkInterceptor)
	@Post()
	moniepoint(@Body() payoutDto: CreatePayoutDto) {
		return this.payoutService.moniepointPayout(payoutDto);
	}
}
