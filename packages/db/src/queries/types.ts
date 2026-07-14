import { TRANSACTION_STATUS } from "../enums";
import { PaginationCursor } from "./pagination";

export type TransactionPaginationOption = {
	date_from?: Date;
	date_to?: Date;
	status?: TRANSACTION_STATUS;
	amount?: number;
	clientId?: string;
	limit?: number;
	cursor?: PaginationCursor;
};
