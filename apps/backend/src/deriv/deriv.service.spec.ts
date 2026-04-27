import { Test, TestingModule } from "@nestjs/testing";
import { DerivService } from "./deriv.service";

describe("DerivService", () => {
	let service: DerivService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [DerivService],
		}).compile();

		service = module.get<DerivService>(DerivService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
