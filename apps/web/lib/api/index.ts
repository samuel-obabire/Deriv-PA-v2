import { kycRecordService } from "./kyc-record-service";
import { tokenService } from "./token-service";
import { transactionService } from "./transaction-service";

export const api = {
	tokenService,
	transactionService,
	kycRecordService,
};
