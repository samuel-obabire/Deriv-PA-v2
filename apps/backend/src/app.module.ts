import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_PIPE } from "@nestjs/core";
import { ZodValidationPipe } from "nestjs-zod";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database/database.module";
import { PayoutModule } from "./payout/payout.module";
import { WithdrawalRequestModule } from "./withdrawal-request/withdrawal-request.module";
import { MatcherService } from './matcher/matcher.service';
import { MatcherModule } from './matcher/matcher.module';
import { ProcessorModule } from './processor/processor.module';
import { RateModule } from './rate/rate.module';

@Module({
	imports: [
		DatabaseModule,
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		PayoutModule,
		WithdrawalRequestModule,
		MatcherModule,
		ProcessorModule,
		RateModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_PIPE,
			useClass: ZodValidationPipe,
		},
		MatcherService,
	],
})
export class AppModule {}
