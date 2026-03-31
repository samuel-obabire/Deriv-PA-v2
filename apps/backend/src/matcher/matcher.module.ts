import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { MatcherService } from "./matcher.service";

@Module({
	imports: [DatabaseModule],
	providers: [MatcherService],
	exports: [MatcherService],
})
export class MatcherModule {}
