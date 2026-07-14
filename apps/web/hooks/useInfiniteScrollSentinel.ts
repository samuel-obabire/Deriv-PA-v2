"use client";

import { useInView } from "react-intersection-observer";

// Shared sentinel element config for infinite-scroll lists (Statement,
// Transaction History): fires once the sentinel is ~10px from entering the
// viewport, so the next page loads slightly ahead of the user reaching it.
const useInfiniteScrollSentinel = () => {
	const { ref, inView } = useInView({
		threshold: 0.01,
		rootMargin: "0px 0px 10px 0px",
	});

	return { ref, inView };
};

export default useInfiniteScrollSentinel;
