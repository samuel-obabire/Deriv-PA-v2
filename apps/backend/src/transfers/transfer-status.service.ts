import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from "@nestjs/common";
import type { Transaction } from "@repo/db";
import { TRANSACTION_TYPE } from "@repo/db/enums";
import type { TransferStatusCheckOutcome } from "@repo/deriv";
import { CurrencyTokenService } from "src/currency/currency-token.service";
import { isRequestIdNotFoundError } from "src/deriv/deriv-errors";
import { DerivRestClient } from "src/deriv/deriv-rest-client";
import { TransactionService } from "src/transactions/transaction.service";

@Injectable()
export class TransferStatusService {
	constructor(
		private readonly transactionService: TransactionService,
		private readonly currencyTokenService: CurrencyTokenService,
		private readonly derivRestClient: DerivRestClient,
	) {}

	async checkStatus(transactionId: string, orgId: string) {
		const transaction = await this.transactionService.findById(transactionId);

		if (!transaction || transaction.organizationId !== orgId) {
			throw new NotFoundException("Transaction not found");
		}

		const status = await this.resolveDerivStatus(transaction);

		return { transaction, status };
	}

	private async resolveDerivStatus(
		transaction: Transaction,
	): Promise<TransferStatusCheckOutcome> {
		if (
			transaction.type !== TRANSACTION_TYPE.WITHDRAWAL ||
			!transaction.idempotencyKey
		) {
			return { outcome: "no_deriv_transfer" };
		}

		const tokenId = await this.currencyTokenService.getTokenIdForCurrency(
			transaction.organizationId,
			transaction.currency,
		);

		if (!tokenId) {
			throw new InternalServerErrorException(
				"No Deriv token configured for this transaction's currency",
			);
		}

		const token = await this.currencyTokenService.getDecryptedOrgToken(
			transaction.organizationId,
			tokenId,
		);

		try {
			const result = await this.derivRestClient.paymentAgentTransferStatus(
				token,
				transaction.idempotencyKey,
			);

			return {
				outcome: "resolved",
				derivStatus: result.data.status,
				derivTransactionId: result.data.transaction_id,
			};
		} catch (error) {
			if (isRequestIdNotFoundError(error)) {
				return { outcome: "not_found" };
			}

			return { outcome: "deriv_unavailable" };
		}
	}
}
