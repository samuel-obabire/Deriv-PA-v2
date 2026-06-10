"use client";

import {
	type DerivRequestPayload,
	type StatementActionType,
} from "@repo/deriv";
import { tryCatch } from "@repo/utils";
import { useCallback, useState } from "react";

import useSocket from "@/hooks/useSocket";

type StatementOptions = {
	limit?: number;
	offset?: number;
	action_type?: StatementActionType;
};

const useStatement = () => {
	const [isLoading, setIsLoading] = useState(false);
	const { socketClient } = useSocket();

	const getStatement = useCallback(
		async (options: StatementOptions) => {
			if (!socketClient) return null;

			setIsLoading(true);

			const [result, error] = await tryCatch(() =>
				socketClient.getStatement({
					statement: 1,
					description: 1,
					...options,
				} as DerivRequestPayload<"statement">),
			);

			setIsLoading(false);

			if (error) return null;

			return result.statement ?? null;
		},
		[socketClient],
	);

	return [isLoading, getStatement] as const;
};

export default useStatement;
