import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigType } from "@nestjs/config";
import { DatabaseModule } from "src/database/database.module";
import { DerivModule } from "src/deriv/deriv.module";
import redisConfig from "src/iam/redis/redis.config";
import { CUSTOMER_RECORD } from "./constants";
import { CustomerRecordProcessor } from "./customer-record.processor";
import { CustomerRecordService } from "./customer-record.service";

@Module({
	imports: [
		BullModule.forRootAsync({
			imports: [ConfigModule.forFeature(redisConfig)],
			inject: [redisConfig.KEY],
			useFactory: (redis: ConfigType<typeof redisConfig>) => ({
				connection: redis,
			}),
		}),

		BullModule.registerQueue({
			name: CUSTOMER_RECORD,
			defaultJobOptions: {
				removeOnComplete: true,
				removeOnFail: true,
			},
		}),
		DerivModule,
		DatabaseModule,
	],

	providers: [CustomerRecordService, CustomerRecordProcessor],
	exports: [CustomerRecordService],
})
export class CustomerRecordModule {}
