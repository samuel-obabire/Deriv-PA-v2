// The statement feature's action-type filter, kept as its own named export
// since the frontend filter UI iterates over it directly. It maps 1:1 onto
// the wallet transactions endpoint's `category` field (see ../rest.ts) —
// deposit/withdrawal only. The old Deriv WS "statement" call also had
// buy/sell for contract activity, but that never applies to the
// payment_agent wallet this feature now reads from.
import type { DerivWalletTransactionCategory } from "../rest";

export const STATEMENT_ACTION_TYPE = [
	"deposit",
	"withdrawal",
] as const satisfies readonly DerivWalletTransactionCategory[];

export type StatementActionType = (typeof STATEMENT_ACTION_TYPE)[number];

// Deriv types metadata.transaction_status as a bare `string`, not an enum —
// this is the known set observed in practice (including "reverted", which
// has no equivalent in our own TRANSACTION_STATUS). Display-only: treat any
// value outside this list as unrecognized rather than assuming it can't happen.
export const DERIV_WALLET_TRANSACTION_STATUS = [
	"pending",
	"processing",
	"complete",
	"failed",
	"cancelled",
	"reverted",
] as const;

export type DerivWalletTransactionStatus =
	(typeof DERIV_WALLET_TRANSACTION_STATUS)[number];
