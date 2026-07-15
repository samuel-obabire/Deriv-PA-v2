"use client";

import { type StatementQuery, type StatementResult } from "@repo/deriv";
import { tryCatch } from "@repo/utils";
import { useCallback, useState } from "react";

import useSocket from "@/hooks/useSocket";

export type StatementOptions = StatementQuery;

const useStatement = () => {
	const [isLoading, setIsLoading] = useState(false);
	const { socketClient } = useSocket();

	const getStatement = useCallback(
		async (options: StatementOptions): Promise<StatementResult | null> => {
			if (!socketClient) return null;

			setIsLoading(true);

			const [result, error] = await tryCatch(() =>
				socketClient.getStatement(options),
			);

			setIsLoading(false);

			if (error) return null;

			return result;
		},
		[socketClient],
	);

	return [isLoading, getStatement] as const;
};

export default useStatement;
