"use client";

import { type StatementResult } from "@repo/deriv";
import { tryCatch } from "@repo/utils";
import { useCallback, useState } from "react";

import { type StatementRequest, statementApi } from "@/lib/api/statement";

export type StatementOptions = StatementRequest;

const useStatement = () => {
	const [isLoading, setIsLoading] = useState(false);

	const getStatement = useCallback(
		async (options: StatementOptions): Promise<StatementResult | null> => {
			setIsLoading(true);

			const [result, error] = await tryCatch(() =>
				statementApi.getStatement(options),
			);

			setIsLoading(false);

			if (error || !result.success) return null;

			return result.data ?? null;
		},
		[],
	);

	return [isLoading, getStatement] as const;
};

export default useStatement;
