import type { TransactionFilters } from "@/context/TransactionFiltersProvider";

export const buildTransactionSearchParams = (filters: TransactionFilters) => {
	const { date_from, date_to, status, amount, ngnAmount, clientId } = filters;

	const searchParams = new URLSearchParams();

	if (date_from) searchParams.append("date_from", date_from.toISOString());
	if (date_to) searchParams.append("date_to", date_to.toISOString());
	if (status) searchParams.append("status", status);
	if (amount) searchParams.append("amount", amount.toString());
	if (ngnAmount) searchParams.append("ngnAmount", ngnAmount.toString());
	if (clientId) searchParams.append("clientId", clientId);

	return searchParams.toString();
};
