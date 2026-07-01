export enum KYC_STATUS {
	UNVERIFIED = "unverified",
	PENDING_REVIEW = "pending_review",
	VERIFIED = "verified",
	REJECTED = "rejected",
}

export enum KYC_REJECTION_REASON {
	BLURRY_DOCUMENT = "blurry_document",
	DOCUMENT_EXPIRED = "document_expired",
	NAME_MISMATCH = "name_mismatch",
	INCOMPLETE_SUBMISSION = "incomplete_submission",
	FRAUDULENT_DOCUMENT = "fraudulent_document",
}

export enum KYC_DOCUMENT_TYPE {
	NATIONAL_ID = "national_id",
	INTERNATIONAL_PASSPORT = "international_passport",
	DRIVERS_LICENSE = "drivers_license",
	VOTERS_CARD = "voters_card",
}

export enum CLIENT_CUSTOMER_TYPE {
	EXISTING = "existing",
	NEW = "new",
}

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
	PROCESSING = "processing",
	COMPLETED = "completed",
	FAILED = "failed",
	CANCELLED = "cancelled",
}
