import {
	Inject,
	Injectable,
	InternalServerErrorException,
} from "@nestjs/common";
import type { DB } from "@repo/db";
import { getCurrentRate } from "@repo/db";

import { DRIZZLE } from "src/database/constant";

@Injectable()
export class RateService {
	constructor(@Inject(DRIZZLE) private readonly db: DB) {}

	async getCurrentRate() {
		const currentRate = await getCurrentRate(this.db);

		if (!currentRate) throw new InternalServerErrorException();

		return currentRate;
	}
}
