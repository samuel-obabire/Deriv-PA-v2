"use client";

import { type CURRENCY } from "@repo/db/enums";
import { tryCatch } from "@repo/utils";
import { useCallback, useRef, useState, useTransition } from "react";

import useSocket from "@/hooks/useSocket";

const useClientName = (
	clientAccount: string | null,
	currency: string,
	minAmount: number,
) => {
	const { socketClient } = useSocket();
	const [name, setName] = useState<string | undefined>();
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState(false);
	const isFetchingRef = useRef(false);

	const fetchName = useCallback(async () => {
		if (!socketClient || !clientAccount || name || isFetchingRef.current)
			return;

		isFetchingRef.current = true;
		setError(false);
		startTransition(async () => {
			const [result, fetchError] = await tryCatch(() =>
				socketClient.validateClientName({
					paymentagent_transfer: 1,
					transfer_to: clientAccount,
					currency: currency as CURRENCY,
					amount: minAmount,
					dry_run: 1,
				}),
			);
			isFetchingRef.current = false;
			if (!fetchError && result?.paymentagent_transfer === 2) {
				setName(result.client_to_full_name ?? undefined);
			} else {
				setError(true);
			}
		});
	}, [socketClient, clientAccount, currency, minAmount, name]);

	return { name, isPending, error, fetchName };
};

export default useClientName;
