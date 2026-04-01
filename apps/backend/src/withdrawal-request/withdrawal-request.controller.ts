import { Body, Controller, Post, UseInterceptors } from "@nestjs/common";
import { WebhookAlwaysOkInterceptor } from "src/common/webhook-always-ok/webhook-always-ok.interceptor";
import { CreateWithdrawalRequestDto } from "./dto/create-withdrawal-request.dto";
import { WithdrawalRequestService } from "./withdrawal-request.service";

@Controller("withdrawal-request")
export class WithdrawalRequestController {
	constructor(
		private readonly withdrawalRequestService: WithdrawalRequestService,
	) {}

	@UseInterceptors(WebhookAlwaysOkInterceptor)
	@Post()
	create(@Body() createWithdrawalRequestDto: CreateWithdrawalRequestDto) {
		return this.withdrawalRequestService.create(createWithdrawalRequestDto);
	}
}
