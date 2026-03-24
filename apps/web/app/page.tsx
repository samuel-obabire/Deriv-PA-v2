import { withdrawalRequest } from "@repo/db";
import { db } from "lib/db";

export default async function Home() {
	const data = await db.select().from(withdrawalRequest);

	return <div className="text-2xl  text-primary">{data[0]?.derivId}</div>;
}
