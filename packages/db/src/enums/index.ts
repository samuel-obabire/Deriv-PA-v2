export enum PAYOUT_STATUS {
	UNMATCHED = "UNMATCHED",
	MATCHED = "MATCHED",
	FLAGGED = "FLAGGED",
}

export enum WITHDRAWAL_STATUS {
	PENDING = "PENDING",
	MATCHED = "MATCHED",
	FLAGGED = "FLAGGED",
	MISSING = "MISSING",
}

export enum CURRENCY {
	USD = "USD",
	USDC = "USDC",
	eUSDT = "eUSDT",
	tUSDT = "tUSDT",
}

export enum TRANSACTION_TYPE {
	DEPOSIT = "deposit",
	WITHDRAWAL = "withdrawal",
}

export enum TRANSACTION_STATUS {
	PENDING = "pending",
	COMPLETED = "completed",
	FAILED = "failed",
}
