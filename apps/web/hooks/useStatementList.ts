"use client";

import type { DerivCurrency, StatementActionType } from "@repo/deriv";
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

	const [isLoading, getStatement] = useStatement();
	const getStatementRef = useRef(getStatement);
	getStatementRef.current = getStatement;

	const { ref: sentinelRef, inView } = useInView({
		threshold: 0.01,
		rootMargin: "0px 0px 10px 0px",
	});

	useEffect(() => {
		if (!socketClient || !selectedCurrency) return;

		setTransactions([]);
		setHasMore(true);

		(async () => {
			const result = await getStatementRef.current({
				limit: LIMIT,
				action_type: statementType,
				currency: selectedCurrency as DerivCurrency,
			});

			if (result?.transactions?.length) {
				setTransactions(result.transactions as StatementTransaction[]);
			}
		})();
	}, [socketClient, selectedCurrency, statementType]);

	useEffect(() => {
		if (!inView || !selectedCurrency || !socketClient || isLoading || !hasMore)
			return;

		(async () => {
			const result = await getStatementRef.current({
				limit: LIMIT,
				offset: transactions.length,
				action_type: statementType,
				currency: selectedCurrency as DerivCurrency,
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
