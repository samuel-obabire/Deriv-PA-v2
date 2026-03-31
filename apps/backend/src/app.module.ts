import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_PIPE } from "@nestjs/core";
import { ZodValidationPipe } from "nestjs-zod";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { LoggingMiddleware } from "./common/middleware/logging/logging.middleware";
import { DatabaseModule } from "./database/database.module";
import { MatcherModule } from "./matcher/matcher.module";
import { MatcherService } from "./matcher/matcher.service";
import { PayoutModule } from "./payout/payout.module";
import { ProcessorModule } from "./processor/processor.module";
import { RateModule } from "./rate/rate.module";
import { WithdrawalRequestModule } from "./withdrawal-request/withdrawal-request.module";

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
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggingMiddleware).forRoutes("*splat");
	}
}
