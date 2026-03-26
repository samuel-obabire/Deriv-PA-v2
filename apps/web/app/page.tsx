import { verifySession } from "@/lib/session";

const HomePage = async () => {
	await verifySession();

	return <div className="text-2xl  text-primary">CR2091245</div>;
};

export default HomePage;
