"use client";

import { useEffect, useRef } from "react";
import ROUTES from "@/lib/constants/routes";

const POLL_INTERVAL_MS = 10_000;
const POLL_TIMEOUT_MS = 2 * 60 * 1000;

const useAccessRequestPolling = (
	grantId: string | null,
	onGranted: () => void,
) => {
	const onGrantedRef = useRef(onGranted);
	onGrantedRef.current = onGranted;

	useEffect(() => {
		if (!grantId) return;

		const interval = setInterval(async () => {
			try {
				const res = await fetch(ROUTES.ACCESS_REQUEST_STATUS(grantId));
				const json = await res.json();
				if (json.success && json.data.isGranted) {
					onGrantedRef.current();
				}
			} catch {
				// Ignore transient network errors; the next poll will retry.
			}
		}, POLL_INTERVAL_MS);

		const timeout = setTimeout(() => clearInterval(interval), POLL_TIMEOUT_MS);

		return () => {
			clearInterval(interval);
			clearTimeout(timeout);
		};
	}, [grantId]);
};

export default useAccessRequestPolling;
