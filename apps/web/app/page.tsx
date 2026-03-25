import { withdrawalRequest } from "@repo/db";
import { tryCatch } from "@repo/utils";
import { db } from "lib/db";

export default async function Home() {
	const [data, error] = await tryCatch(db.select().from(withdrawalRequest));

	if (error)
		return <div className="text-2xl  text-primary">{error.message}</div>;

	return <div className="text-2xl  text-primary">{data[0]?.derivId}</div>;
}
