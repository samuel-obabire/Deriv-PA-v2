import { SearchParams } from "nuqs/server";

export type PageProps = {
	searchParams: Promise<SearchParams>;
};
