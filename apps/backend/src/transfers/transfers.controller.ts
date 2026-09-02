import { Controller, Delete, Get, Param, Query } from "@nestjs/common";
import { Public } from "src/common/decorators/public.decorator";
import { TransferQueueService } from "./transfer-queue.service";
import { TransferStatusService } from "./transfer-status.service";

@Controller("transfers")
export class TransfersController {
	constructor(
		private readonly transferQueueService: TransferQueueService,
		private readonly transferStatusService: TransferStatusService,
	) {}

	@Public()
	@Delete(":id")
	cancelTransfer(
		@Param("id") transferId: string,
		@Query("orgId") orgId: string,
	) {
		return this.transferQueueService.cancelTransfer(transferId, orgId);
	}

	@Get(":id/status")
	checkStatus(
		@Param("id") transactionId: string,
		@Query("orgId") orgId: string,
	) {
		return this.transferStatusService.checkStatus(transactionId, orgId);
	}
}
