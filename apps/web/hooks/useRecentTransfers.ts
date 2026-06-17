"use client";

import type { Transaction } from "@repo/db";
import { TRANSACTION_STATUS, TRANSACTION_TYPE } from "@repo/db/enums";
import { useEffect, useState } from "react";

export type NewTransferData = {
	id: string;
	clientAccount: string;
	clientName?: string | null;
	amount: string;
	currency: string;
};

const useRecentTransfers = (initialTransfers: Transaction[]) => {
	const [transfers, setTransfers] = useState<Transaction[]>(initialTransfers);

	// Sync when server data changes (e.g. after page re-render)
	useEffect(() => {
		setTransfers(initialTransfers);
	}, [initialTransfers]);

	const addTransfer = (data: NewTransferData) => {
		const entry = {
			id: data.id,
			idempotencyKey: null,
			clientId: data.clientAccount,
			clientName: data.clientName ?? null,
			organizationId: "",
			staffId: null,
			amount: data.amount,
			type: TRANSACTION_TYPE.DEPOSIT,
			currency: data.currency,
			status: TRANSACTION_STATUS.PENDING,
			createdAt: new Date(),
			updatedAt: new Date(),
		} as Transaction;

		setTransfers((prev) => {
			// Avoid duplicates if server data arrives before hook updates
			const deduped = prev.filter((t) => t.id !== data.id);
			return [entry, ...deduped].slice(0, 5);
		});
	};

	const onTransferCancelled = (transferId: string) => {
		setTransfers((prev) =>
			prev.map((t) =>
				t.id === transferId
					? { ...t, status: TRANSACTION_STATUS.CANCELLED }
					: t,
			),
		);
	};

	return { transfers, addTransfer, onTransferCancelled };
};

export default useRecentTransfers;
