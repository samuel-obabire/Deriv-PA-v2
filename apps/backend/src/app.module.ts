import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_PIPE } from "@nestjs/core";
import { ZodValidationPipe } from "nestjs-zod";
import { AppService } from "./app.service";
import { CommonModule } from "./common/common.module";
import { LoggingMiddleware } from "./common/middleware/logging/logging.middleware";
import { envSchema } from "./common/validation";
import { DatabaseModule } from "./database/database.module";
import { DerivModule } from "./deriv/deriv.module";
import { AuthenticationController } from "./iam/authentication/authentication.controller";
import { IamModule } from "./iam/iam.module";
import { MatcherModule } from "./matcher/matcher.module";
import { MatcherService } from "./matcher/matcher.service";
import { OrganisationModule } from "./organisation/organisation.module";
import { OrganisationService } from "./organisation/organisation.service";
import { PayoutModule } from "./payout/payout.module";
import { ProcessorModule } from "./processor/processor.module";
import { RateModule } from "./rate/rate.module";
import { WithdrawalRequestModule } from "./withdrawal-request/withdrawal-request.module";

@Module({
	imports: [
		DatabaseModule,
		ConfigModule.forRoot({
			isGlobal: true,
			validate: (config) => envSchema.parse(config),
		}),
		PayoutModule,
		WithdrawalRequestModule,
		MatcherModule,
		ProcessorModule,
		RateModule,
		DerivModule,
		OrganisationModule,
		IamModule,
		CommonModule,
	],
	providers: [
		AppService,
		{
			provide: APP_PIPE,
			useClass: ZodValidationPipe,
		},
		MatcherService,
		OrganisationService,
	],
	controllers: [AuthenticationController],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggingMiddleware).forRoutes("*splat");
	}
}
