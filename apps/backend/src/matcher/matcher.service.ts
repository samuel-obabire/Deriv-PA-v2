import { Injectable } from "@nestjs/common";
import { withdrawalRequest } from "@repo/db";
import { WITHDRAWAL_STATUS } from "@repo/db/enums";
import { and, eq, or, sql } from "drizzle-orm";
import { DatabaseService } from "src/database/database.service";

const TOLERANCE = 3;
const DERIV_TRANSFER_URL =
	"https://deriv-pa-server.onrender.com/api/deriv/transfer-to-client";

type Currency = string;

type PaymentAgentActionResponse = {
	clientAccount: string;
	clientName: string;
	currency: Currency;
	transactionId: number;
	paymentAgentTransfer: 1 | 2;
	amount: number;
	agentAccount: string;
	description?: string;
};

type PaymentAgentTransferRequest = {
	paymentagent_transfer: 1;
	amount: number;
	currency: string;
	description?: string;
	dry_run?: 0 | 1;
	transfer_to: string;
	loginid?: string;
};

@Injectable()
export class MatcherService {
	constructor(private readonly databaseService: DatabaseService) {}

	private async resolveClientName(loginid: string): Promise<string | null> {
		try {
			const transferRequest: PaymentAgentTransferRequest = {
				paymentagent_transfer: 1,
				amount: 1,
				currency: "USD",
				transfer_to: loginid,
				dry_run: 1,
			};

			const response = await fetch(DERIV_TRANSFER_URL, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					transferRequest,
					token: process.env.TRANSFER_TOKEN,
				}),
			});

			if (!response.ok) return null;

			const data = (await response.json()) as PaymentAgentActionResponse;
			return data.clientName ?? null;
		} catch {
			return null;
		}
	}

	async findPayoutMatch({
		amount,
		narration,
		cr,
	}: {
		amount: number;
		narration: string;
		cr: string | null;
	}) {
		const min = amount - TOLERANCE;
		const max = amount + TOLERANCE;

		const derivClientName = cr ? await this.resolveClientName(cr) : null;
		const nameForMatch = derivClientName ?? narration;

		const whereCondition = cr
			? or(
					and(
						eq(withdrawalRequest.derivId, cr),
						eq(withdrawalRequest.status, WITHDRAWAL_STATUS.PENDING),
						sql`${withdrawalRequest.createdAt} >= NOW() - INTERVAL '59 minutes'`,
						sql`${withdrawalRequest.amountNgn} BETWEEN ${min} AND ${max}`,
					),

					and(
						eq(withdrawalRequest.status, WITHDRAWAL_STATUS.PENDING),
						sql`${withdrawalRequest.createdAt} >= NOW() - INTERVAL '59 minutes'`,
						sql`word_similarity(${withdrawalRequest.clientName}, ${nameForMatch}) > 0.3`,
						sql`${withdrawalRequest.amountNgn} BETWEEN ${min} AND ${max}`,
					),
				)
			: and(
					eq(withdrawalRequest.status, WITHDRAWAL_STATUS.PENDING),
					sql`${withdrawalRequest.createdAt} >= NOW() - INTERVAL '59 minutes'`,
					sql`word_similarity(${withdrawalRequest.clientName}, ${nameForMatch}) > 0.3`,
					sql`${withdrawalRequest.amountNgn} BETWEEN ${min} AND ${max}`,
				);

		const bestMatchingDerivWithdrawal =
			await this.databaseService.client.query.withdrawalRequest.findFirst({
				where: whereCondition,
			});

		return bestMatchingDerivWithdrawal;
	}
}
