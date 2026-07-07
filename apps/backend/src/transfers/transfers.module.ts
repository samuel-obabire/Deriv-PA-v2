import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigType } from "@nestjs/config";
import { CurrencyModule } from "src/currency/currency.module";
import { DerivModule } from "src/deriv/deriv.module";
import { IamModule } from "src/iam/iam.module";
import redisConfig from "src/iam/redis/redis.config";
import { TransactionsModule } from "src/transactions/transactions.module";
import { TRANSFERS } from "./constants";
import { TransferProcessor } from "./transfer.processor";
import { TransferQueueService } from "./transfer-queue.service";
import { TransfersController } from "./transfers.controller";

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
			name: TRANSFERS,
			defaultJobOptions: {
				attempts: 1,
				removeOnComplete: 1000,
				removeOnFail: 3000,
			},
		}),
		DerivModule,
		CurrencyModule,
		TransactionsModule,
		IamModule,
	],
	controllers: [TransfersController],
	providers: [TransferQueueService, TransferProcessor],
	exports: [TransferQueueService],
})
export class TransfersModule {}
