"use client";

import { type CURRENCY } from "@repo/db/enums";
import { tryCatch } from "@repo/utils";
import { useCallback, useRef, useState, useTransition } from "react";

import useSocket from "@/hooks/useSocket";

export type ClientNameError = "not_connected" | "invalid" | null;

const useClientName = (
	externalReferenceId: string | null,
	currency: string,
	minAmount: number,
) => {
	const { socketClient } = useSocket();
	const [name, setName] = useState<string | undefined>();
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<ClientNameError>(null);
	const isFetchingRef = useRef(false);

	const fetchName = useCallback(async () => {
		if (!socketClient || !externalReferenceId || name || isFetchingRef.current)
			return;

		isFetchingRef.current = true;
		setError(null);
		startTransition(async () => {
			const [lookup, lookupError] = await tryCatch(() =>
				socketClient.resolveClientNickname(externalReferenceId),
			);

			if (lookupError) {
				isFetchingRef.current = false;
				setError("invalid");
				return;
			}

			if (!lookup.nickname) {
				isFetchingRef.current = false;
				setError("not_connected");
				return;
			}

			const [result, validationError] = await tryCatch(() =>
				socketClient.validateClientName(
					{
						to_nickname: lookup.nickname as string,
						currency: currency as CURRENCY,
						amount: minAmount.toFixed(2),
						notes: "",
						request_id: crypto.randomUUID(),
					},
					externalReferenceId,
				),
			);
			isFetchingRef.current = false;
			if (!validationError && result && result.client_real_name !== null) {
				setName(result.client_real_name);
			} else {
				setError("invalid");
			}
		});
	}, [socketClient, externalReferenceId, currency, minAmount, name]);

	return { name, isPending, error, fetchName };
};

export default useClientName;
