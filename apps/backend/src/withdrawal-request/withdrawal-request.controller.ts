import { Body, Controller, Post } from "@nestjs/common";
import { CreateWithdrawalRequestDto } from "./dto/create-withdrawal-request.dto";
import { WithdrawalRequestService } from "./withdrawal-request.service";

@Controller("withdrawal-request")
export class WithdrawalRequestController {
	constructor(
		private readonly withdrawalRequestService: WithdrawalRequestService,
	) {}

	@Post()
	create(@Body() createWithdrawalRequestDto: CreateWithdrawalRequestDto) {
		return this.withdrawalRequestService.create(createWithdrawalRequestDto);
	}
}
