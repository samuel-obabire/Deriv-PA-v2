"use client";

import { type CURRENCY } from "@repo/db/enums";
import { tryCatch } from "@repo/utils";
import { useCallback, useState } from "react";

import useSocket from "@/hooks/useSocket";

const useClientName = (
	clientAccount: string | null,
	currency: string,
	minAmount: number,
) => {
	const { socketClient } = useSocket();
	const [name, setName] = useState<string | undefined>();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(false);

	const fetchName = useCallback(async () => {
		if (!socketClient || !clientAccount || name || isLoading) return;

		setIsLoading(true);
		setError(false);
		const [result, fetchError] = await tryCatch(() =>
			socketClient.validateTransfer({
				paymentagent_transfer: 1,
				transfer_to: clientAccount,
				currency: currency as CURRENCY,
				amount: minAmount,
				dry_run: 1,
			}),
		);
		setIsLoading(false);

		if (!fetchError && result?.paymentagent_transfer === 2) {
			setName(result.client_to_full_name ?? undefined);
		} else {
			setError(true);
		}
	}, [socketClient, clientAccount, currency, minAmount, name, isLoading]);

	return { name, isLoading, error, fetchName };
};

export default useClientName;
