import type { PayoutRequest } from "@repo/db";

import TransactionsListCard from "./TransactionsListCard";

type TransactionsListProp = {
	transactions: PayoutRequest[];
};

const TransactionsList = ({ transactions }: TransactionsListProp) => {
	return (
		<section className="space-y-3 px-1">
			{transactions.map((tx) => {
				const { id, ...otherProps } = tx;

				return <TransactionsListCard key={id} {...otherProps} />;
			})}
		</section>
	);
};

export default TransactionsList;
