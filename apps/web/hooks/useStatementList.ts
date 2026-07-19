"use client";

import type { DerivCurrency } from "@repo/deriv";
import { useEffect, useRef, useState } from "react";

import useCurrency from "@/hooks/useCurrency";
import useInfiniteScrollSentinel from "@/hooks/useInfiniteScrollSentinel";
import useStatement, { StatementOptions } from "@/hooks/useStatement";
import type { StatementTransaction } from "@/lib/utils/statement";

const LIMIT = 100;

export type FilteredStatementOptions = Pick<
	StatementOptions,
	"action_type" | "date_from" | "date_to"
>;

const buildFetchKey = (currency: string, f: FilteredStatementOptions) =>
	`${currency}|${f.action_type}|${f.date_from}|${f.date_to}`;

const useStatementList = () => {
	const [transactions, setTransactions] = useState<StatementTransaction[]>([]);
	const [cursor, setCursor] = useState<string | null>(null);
	const [hasMore, setHasMore] = useState(true);
	const [filters, setFilters] = useState<FilteredStatementOptions>({});

	const { selectedCurrency } = useCurrency();

	const prevFetchKeyRef = useRef<string | null>(null);
	const fetchGenerationRef = useRef(0);

	const [isLoading, getStatement] = useStatement();
	const getStatementRef = useRef(getStatement);
	getStatementRef.current = getStatement;

	const { ref: sentinelRef, inView } = useInfiniteScrollSentinel();

	useEffect(() => {
		if (!selectedCurrency) return;

		// Pure reconnects (same currency/filters) are caught by prevFetchKeyRef
		// and never trigger a reload.
		const fetchKey = buildFetchKey(selectedCurrency, filters);
		if (prevFetchKeyRef.current === fetchKey) return;

		setTransactions([]);
		setCursor(null);
		setHasMore(true);
		const generation = ++fetchGenerationRef.current;

		(async () => {
			const result = await getStatementRef.current({
				currency: selectedCurrency as DerivCurrency,
				limit: LIMIT,
				...filters,
			});

			if (fetchGenerationRef.current !== generation) return;

			// Only mark this currency/filter combination as settled once its
			// reset fetch has actually landed. Until then, `cursor`/`hasMore`
			// in this render still belong to the previous combination — if we
			// flipped prevFetchKeyRef synchronously above, the infinite-scroll
			// effect below (which re-runs in this same commit) could pair the
			// new currency with a stale cursor from the old one.
			prevFetchKeyRef.current = fetchKey;
			setTransactions(result?.transactions ?? []);
			setCursor(result?.nextCursor ?? null);
			setHasMore(result?.hasMore ?? false);
		})();
	}, [selectedCurrency, filters]);

	useEffect(() => {
		if (!inView || !selectedCurrency || isLoading || !hasMore || !cursor)
			return;

		// Guard against the same-commit race where this effect re-runs right
		// after a currency/filter change, before the reset fetch above has
		// landed — `cursor`/`hasMore` in that render still belong to the
		// previous combination.
		const fetchKey = buildFetchKey(selectedCurrency, filters);
		if (prevFetchKeyRef.current !== fetchKey) return;

		const generation = fetchGenerationRef.current;

		(async () => {
			const result = await getStatementRef.current({
				currency: selectedCurrency as DerivCurrency,
				limit: LIMIT,
				cursor,
				...filters,
			});

			if (fetchGenerationRef.current !== generation) return;

			if (result?.transactions?.length) {
				setTransactions((prev) => [...prev, ...result.transactions]);
			}
			setCursor(result?.nextCursor ?? null);
			setHasMore(result?.hasMore ?? false);
		})();
	}, [inView, selectedCurrency, isLoading, hasMore, cursor, filters]);

	const applyFilters = (f: FilteredStatementOptions) => {
		setFilters(f);
	};

	return {
		transactions,
		isLoading,
		sentinelRef,
		currency: selectedCurrency,
		isConnecting: !selectedCurrency,
		isEmpty: !!selectedCurrency && !isLoading && transactions.length === 0,
		filters,
		applyFilters,
	};
};

export default useStatementList;
