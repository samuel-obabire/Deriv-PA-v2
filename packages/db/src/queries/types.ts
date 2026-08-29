import { TRANSACTION_STATUS } from "../enums";
import { PaginationCursor } from "./pagination";

export type TransactionPaginationOption = {
	date_from?: Date;
	date_to?: Date;
	status?: TRANSACTION_STATUS;
	amount?: number;
	ngnAmount?: number;
	clientId?: string;
	hasNotes?: boolean;
	limit?: number;
	cursor?: PaginationCursor;
};

export type DailySummaryCursor = {
	id: string;
	businessDate: Date;
};

export type DailySummaryPaginationOption = {
	date_from?: Date;
	date_to?: Date;
	limit?: number;
	cursor?: DailySummaryCursor;
};

export type KycRecordPaginationOption = {
	email?: string;
	externalReferenceId?: string;
	derivNickname?: string;
	name?: string;
	limit?: number;
	cursor?: PaginationCursor;
};
