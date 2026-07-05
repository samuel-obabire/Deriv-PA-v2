import { Test, TestingModule } from "@nestjs/testing";
import { DerivService } from "src/deriv/deriv.service";
import { DerivGateway } from "./deriv.gateway";

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
