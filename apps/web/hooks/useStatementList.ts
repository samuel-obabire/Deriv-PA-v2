"use client";

import type { StatementActionType } from "@repo/deriv";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

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
	const { socketClient } = useSocket();
	const prevCurrencyRef = useRef<string | null>(null);
	const prevTypeRef = useRef<StatementActionType | null | undefined>(null);

	const [isLoading, getStatement] = useStatement();

	const { ref: sentinelRef, inView } = useInView({
		threshold: 0.01,
		rootMargin: "0px 0px 10px 0px",
	});

	useEffect(() => {
		if (!selectedCurrency || !socketClient) return;

		if (
			prevCurrencyRef.current !== selectedCurrency ||
			statementType !== prevTypeRef.current
		) {
			prevCurrencyRef.current = selectedCurrency;
			prevTypeRef.current = statementType;
			setTransactions([]);
			setHasMore(true);

			(async () => {
				const result = await getStatement({
					limit: LIMIT,
					action_type: statementType,
				});
				if (result?.transactions?.length) {
					setTransactions(result.transactions as StatementTransaction[]);
				}
			})();
		}
	}, [selectedCurrency, socketClient, getStatement, statementType]);

	useEffect(() => {
		if (!inView || !selectedCurrency || !socketClient || isLoading || !hasMore)
			return;

		(async () => {
			const result = await getStatement({
				limit: LIMIT,
				offset: transactions.length,
				action_type: statementType,
			});

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
		getStatement,
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
