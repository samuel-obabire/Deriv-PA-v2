import { Controller, Delete, Param, Query } from "@nestjs/common";
import { TransferQueueService } from "./transfer-queue.service";

@Controller("transfers")
export class TransfersController {
	constructor(private readonly transferQueueService: TransferQueueService) {}

	@Delete(":id")
	cancelTransfer(
		@Param("id") transferId: string,
		@Query("orgId") orgId: string,
	) {
		return this.transferQueueService.cancelTransfer(transferId, orgId);
	}
}
