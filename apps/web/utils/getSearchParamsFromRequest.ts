import type { NextRequest } from "next/server";

export const getSearchParamsFromRequest = (req: NextRequest) => {
	return Object.fromEntries(req.nextUrl.searchParams.entries());
};
