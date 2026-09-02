import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigType } from "@nestjs/config";
import { CurrencyModule } from "src/currency/currency.module";
import { DerivModule } from "src/deriv/deriv.module";
import { IamModule } from "src/iam/iam.module";
import redisConfig from "src/iam/redis/redis.config";
import { TransactionsModule } from "src/transactions/transactions.module";
import { TRANSFER_RECONCILIATION, TRANSFERS } from "./constants";
import { TransferProcessor } from "./transfer.processor";
import { TransferQueueService } from "./transfer-queue.service";
import { TransferReconciliationProcessor } from "./transfer-reconciliation.processor";
import { TransferReconciliationQueueService } from "./transfer-reconciliation-queue.service";
import { TransferStatusService } from "./transfer-status.service";
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
		BullModule.registerQueue({
			name: TRANSFER_RECONCILIATION,
			defaultJobOptions: {
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
	providers: [
		TransferQueueService,
		TransferProcessor,
		TransferReconciliationQueueService,
		TransferReconciliationProcessor,
		TransferStatusService,
	],
	exports: [TransferQueueService],
})
export class TransfersModule {}
