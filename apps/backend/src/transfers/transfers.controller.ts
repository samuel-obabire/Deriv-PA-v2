import { Controller, Delete, Param, Query } from "@nestjs/common";
import { Public } from "src/common/decorators/public.decorator";
import { TransferQueueService } from "./transfer-queue.service";

@Controller("transfers")
export class TransfersController {
	constructor(private readonly transferQueueService: TransferQueueService) {}

	@Public()
	@Delete(":id")
	cancelTransfer(
		@Param("id") transferId: string,
		@Query("orgId") orgId: string,
	) {
		return this.transferQueueService.cancelTransfer(transferId, orgId);
	}
}
