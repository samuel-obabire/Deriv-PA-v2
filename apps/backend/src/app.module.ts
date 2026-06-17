import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_PIPE } from "@nestjs/core";
import { ScheduleModule } from "@nestjs/schedule";
import { ZodValidationPipe } from "nestjs-zod";
import { AppService } from "./app.service";
import { CommonModule } from "./common/common.module";
import { LoggingMiddleware } from "./common/middleware/logging/logging.middleware";
import { envSchema } from "./common/validation";
import { DatabaseModule } from "./database/database.module";
import { DerivModule } from "./deriv/deriv.module";
import { AuthenticationController } from "./iam/authentication/authentication.controller";
import { IamModule } from "./iam/iam.module";
import { OrganisationModule } from "./organisation/organisation.module";
import { OrganisationService } from "./organisation/organisation.service";
import { TaskModule } from "./task/task.module";
import { TransfersModule } from "./transfers/transfers.module";

@Module({
	imports: [
		DatabaseModule,
		ConfigModule.forRoot({
			isGlobal: true,
			validate: (config) => envSchema.parse(config),
		}),

		DerivModule,
		OrganisationModule,
		IamModule,
		CommonModule,
		ScheduleModule.forRoot(),
		TaskModule,
		TransfersModule,
	],
	providers: [
		AppService,
		{
			provide: APP_PIPE,
			useClass: ZodValidationPipe,
		},

		OrganisationService,
	],
	controllers: [AuthenticationController],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggingMiddleware).forRoutes("*splat");
	}
}
