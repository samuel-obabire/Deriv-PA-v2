import { Test, TestingModule } from "@nestjs/testing";
import { TransfersService } from "./transfer-queue.service";
import { TransfersController } from "./transfers.controller";

describe("TransfersController", () => {
	let controller: TransfersController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [TransfersController],
			providers: [TransfersService],
		}).compile();

		controller = module.get<TransfersController>(TransfersController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
