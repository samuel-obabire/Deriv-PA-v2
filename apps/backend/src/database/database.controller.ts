import { Controller, Get } from "@nestjs/common";
// import { WithdrawalRequestFindManySelectZodSchema } from "@repo/zod";
import { DatabaseService } from "./database.service";

@Controller("database")
export class DatabaseController {
	constructor(private readonly databaseService: DatabaseService) {}

	@Get()
	async getName() {
		// const s = WithdrawalRequestFindManySelectZodSchema.parse({});

		return this.databaseService.withdrawalRequest.findMany();
	}
}
