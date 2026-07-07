// Deriv WebSocket "statement" endpoint's domain types — split out of ws.ts so
// that file can stay focused on the shared WS plumbing (RequestPayload,
// DerivError, RequestHandler, etc.) rather than per-endpoint payload detail.

export type Statement = {
	/**
	 * Number of transactions returned in this call
	 */
	count?: number;
	/**
	 * Array of returned transactions
	 */
	transactions?: {
		/**
		 * It is the type of action.
		 */
		action_type?: StatementActionType;
		/**
		 * It is the amount of transaction.
		 */
		amount?: number;
		/**
		 * ID of the application where this contract was purchased.
		 */
		app_id?: number | null;
		/**
		 * It is the remaining balance.
		 */
		balance_after?: number;
		/**
		 * It is the contract ID.
		 */
		contract_id?: number | null;
		/**
		 * Contains details about fees used for transfer. It is present only when action type is transfer.
		 */
		fees?: {
			/**
			 * Fees amount
			 */
			amount?: number;
			/**
			 * Fees currency
			 */
			currency?: string;
			/**
			 * Minimum amount of fees
			 */
			minimum?: number;
			/**
			 * Fees percentage
			 */
			percentage?: number;
		};
		/**
		 * Contains details of account from which amount was transferred. It is present only when action type is transfer.
		 */
		from?: {
			/**
			 * Login id of the account from which money was transferred.
			 */
			loginid?: string;
		};
		/**
		 * The description of contract purchased if description is set to `1`.
		 */
		longcode?: string;
		/**
		 * Payout price
		 */
		payout?: null | number;
		/**
		 * Time at which contract was purchased, present only for sell transaction
		 */
		purchase_time?: number;
		/**
		 * Internal transaction identifier for the corresponding buy transaction ( set only for contract selling )
		 */
		reference_id?: number | null;
		/**
		 * Compact description of the contract purchased if description is set to `1`.
		 */
		shortcode?: null | string;
		/**
		 * Contains details of account to which amount was transferred. It is present only when action type is transfer.
		 */
		to?: {
			/**
			 * Login id of the account to which money was transferred.
			 */
			loginid?: string;
		};
		/**
		 * It is the transaction ID. In statement every contract (buy or sell) and every payment has a unique ID.
		 */
		transaction_id?: number;
		/**
		 * It is the time of transaction.
		 */
		transaction_time?: number;
		/**
		 * Additional withdrawal details such as typical processing times, if description is set to `1`.
		 */
		withdrawal_details?: string;
	}[];
};

export type StatementActionType = (typeof STATEMENT_ACTION_TYPE)[number];

export const STATEMENT_ACTION_TYPE = [
	"deposit",
	"withdrawal",
	"buy",
	"sell",
] as const;
