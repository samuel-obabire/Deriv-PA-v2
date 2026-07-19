import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Param,
	Post,
	Query,
} from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { Public } from "src/common/decorators/public.decorator";
import { DerivService } from "src/deriv/deriv.service";
import { ScheduleTransferRequestDto } from "./dto/scheduleTransferRequest.dto";
import { TransferValidationRequestDto } from "./dto/transferValidationRequest.dto";
import { TransferQueueService } from "./transfer-queue.service";

@Controller("transfers")
export class TransfersController {
	constructor(
		private readonly transferQueueService: TransferQueueService,
		private readonly derivService: DerivService,
	) {}

	@Post("validate")
	async validateTransfer(@Body() dto: TransferValidationRequestDto) {
		const { organizationId, tokenId, data, options } = dto;

		// DerivService throws WsException for its socket-gateway callers (the
		// duplicate-payment lock, the "token not found" case) — WsException
		// isn't an HttpException, so the global HttpExceptionFilter never
		// catches it here and it would otherwise fall through as a bare,
		// message-less 500. Re-throw as a proper HttpException so the caller
		// gets the actual rejection reason.
		try {
			return await this.derivService.validatePaymentAgentTransfer(
				organizationId,
				{ data, options },
				tokenId,
			);
		} catch (error) {
			if (error instanceof WsException) {
				throw new BadRequestException(error.message);
			}

			throw error;
		}
	}

	@Post()
	scheduleTransfer(@Body() dto: ScheduleTransferRequestDto) {
		const { organizationId, tokenId, userId, data, options } = dto;

		return this.transferQueueService.scheduleTransfer({
			orgId: organizationId,
			tokenId,
			userId,
			transferFundsDto: { data, options },
		});
	}

	@Public()
	@Delete(":id")
	cancelTransfer(
		@Param("id") transferId: string,
		@Query("orgId") orgId: string,
	) {
		return this.transferQueueService.cancelTransfer(transferId, orgId);
	}
}
