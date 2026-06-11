"use client";

import type { DerivCurrency, StatementActionType } from "@repo/deriv";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

import useAccessToken from "@/hooks/useAccessToken";
import useCurrency from "@/hooks/useCurrency";
import useSocket from "@/hooks/useSocket";
import useStatement from "@/hooks/useStatement";
import type { StatementTransaction } from "@/lib/utils/statement";

const LIMIT = 100;

type Params = {
	statementType?: StatementActionType;
};

const useStatementList = ({ statementType }: Params = {}) => {
	const [transactions, setTransactions] = useState<StatementTransaction[]>([]);
	const [hasMore, setHasMore] = useState(true);

	const { selectedCurrency } = useCurrency();
	const { socketClient, connectedAccessToken } = useSocket();
	const { accessToken, tokenCurrency } = useAccessToken();

	const prevFetchKeyRef = useRef<string | null>(null);
	const fetchGenerationRef = useRef(0);

	const [isLoading, getStatement] = useStatement();
	const getStatementRef = useRef(getStatement);
	getStatementRef.current = getStatement;

	const { ref: sentinelRef, inView } = useInView({
		threshold: 0.01,
		rootMargin: "0px 0px 10px 0px",
	});

	useEffect(() => {
		if (!socketClient || !selectedCurrency) return;

		// Two guards close two timing gaps in the currency-rotation sequence:
		//   tokenCurrency ≠ selectedCurrency  — new JWT not yet fetched; old socket still in use
		//   connectedAccessToken ≠ accessToken — JWT rotated but socket hasn't reconnected yet
		// Both must match so we never fetch via the old account's socket.
		// Pure reconnects (same token, same currency) pass both but are caught by
		// prevFetchKeyRef, so they never trigger a reload.
		if (
			tokenCurrency !== selectedCurrency ||
			connectedAccessToken !== accessToken
		)
			return;

		const fetchKey = `${selectedCurrency}|${statementType}`;
		if (prevFetchKeyRef.current === fetchKey) return;
		prevFetchKeyRef.current = fetchKey;

		setTransactions([]);
		setHasMore(true);
		const generation = ++fetchGenerationRef.current;

		(async () => {
			const result = await getStatementRef.current({
				limit: LIMIT,
				action_type: statementType,
				currency: selectedCurrency as DerivCurrency,
			});
			if (fetchGenerationRef.current !== generation) return;
			if (result?.transactions?.length) {
				setTransactions(result.transactions as StatementTransaction[]);
			}
		})();
	}, [
		socketClient,
		connectedAccessToken,
		accessToken,
		tokenCurrency,
		selectedCurrency,
		statementType,
	]);

	useEffect(() => {
		if (!inView || !selectedCurrency || !socketClient || isLoading || !hasMore)
			return;

		const generation = fetchGenerationRef.current;

		(async () => {
			const result = await getStatementRef.current({
				limit: LIMIT,
				offset: transactions.length,
				action_type: statementType,
				currency: selectedCurrency as DerivCurrency,
			});

			if (fetchGenerationRef.current !== generation) return;

			if (result?.transactions?.length) {
				setTransactions((prev) => [
					...prev,
					...(result.transactions as StatementTransaction[]),
				]);
			} else {
				setHasMore(false);
			}
		})();
	}, [
		inView,
		selectedCurrency,
		socketClient,
		isLoading,
		transactions.length,
		hasMore,
		statementType,
	]);

	return {
		transactions,
		isLoading,
		sentinelRef,
		currency: selectedCurrency,
		isConnecting: !socketClient,
		isEmpty: !!socketClient && !isLoading && transactions.length === 0,
	};
};

export default useStatementList;
