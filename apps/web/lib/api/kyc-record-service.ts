import { ClientKycRecord } from "@repo/db";
import { PaginationCursor } from "@repo/db/queries";
import fetchHandler from "@repo/lib/handlers/fetch";
import { ActionResponse } from "@repo/lib/types";
import { clientEnv } from "../validations/env/client";

const getKycRecordUrl = (
	searchParams?: string,
	cursor?: PaginationCursor | null,
) => {
	const params = new URLSearchParams(searchParams);

	if (cursor) {
		params.set("cursorId", cursor.id);
		params.set("cursorDate", new Date(cursor.createdAt).toISOString());
	}

	return `${clientEnv.NEXT_PUBLIC_URL}/api/kyc-records?${params.toString()}`;
};

export type FetchKycRecordResponse = ActionResponse<{
	records: ClientKycRecord[];
	cursor?: PaginationCursor;
}>;

export const kycRecordService = {
	getKycRecords: async (searchParams: string, cursor?: PaginationCursor) => {
		return fetchHandler<FetchKycRecordResponse>(
			getKycRecordUrl(searchParams, cursor),
		);
	},
};
