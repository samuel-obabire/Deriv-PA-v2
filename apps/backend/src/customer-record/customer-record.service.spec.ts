import { Test, TestingModule } from "@nestjs/testing";
import { CustomerRecordService } from "./customer-record.service";

describe("CustomerRecordService", () => {
	let service: CustomerRecordService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [CustomerRecordService],
		}).compile();

		service = module.get<CustomerRecordService>(CustomerRecordService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
