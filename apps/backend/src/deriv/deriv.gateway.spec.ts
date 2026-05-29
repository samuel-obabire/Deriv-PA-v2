import { Test, TestingModule } from "@nestjs/testing";
import { DerivGateway } from "./deriv.gateway";
import { DerivService } from "./deriv.service";

describe("DerivGateway", () => {
	let gateway: DerivGateway;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [DerivGateway, DerivService],
		}).compile();

		gateway = module.get<DerivGateway>(DerivGateway);
	});

	it("should be defined", () => {
		expect(gateway).toBeDefined();
	});
});
