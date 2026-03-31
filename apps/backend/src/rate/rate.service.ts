import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { rate } from "@repo/db";
import { RATE_ID } from "@repo/utils";
import { eq } from "drizzle-orm";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class RateService {
	constructor(private readonly databaseService: DatabaseService) {}

	async getCurrentRate() {
		const [currentRate] = await this.databaseService.client
			.select()
			.from(rate)
			.where(eq(rate.id, RATE_ID));

		if (!currentRate) throw new InternalServerErrorException();

		return currentRate;
	}
}
