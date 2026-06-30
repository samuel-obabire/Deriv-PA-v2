export const buildUrlSearchParams = (
	resolvedParams: Record<string, string | string[] | undefined>,
) => {
	const params = new URLSearchParams();

	Object.entries(resolvedParams).forEach(([key, val]) => {
		if (typeof val === "string") {
			params.set(key, val);
		} else if (Array.isArray(val)) {
			val.forEach((val) => {
				params.append(key, val);
			});
		}
	});

	const urlParams = params.toString();

	return urlParams;
};

export const encodeCallbackUrl = (path: string) => {
	return `?callbackUrl=${encodeURIComponent(path)}`;
};
