import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { RateService } from "./rate.service";

@Module({
	imports: [DatabaseModule],
	providers: [RateService],
	exports: [RateService],
})
export class RateModule {}
