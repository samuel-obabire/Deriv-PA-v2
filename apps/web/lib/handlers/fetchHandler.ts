const fetchHandler = async <T>(url: string, options?: RequestInit) => {
	const res = await fetch(url, {
		headers: {
			"Content-Type": "application/json",
			...options?.headers,
		},
	});

	if (!res.ok) throw new Error("Failed to fetch data");

	return (await res.json()) as T;
};

export default fetchHandler;
