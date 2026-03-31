import { redirect } from "next/navigation";
import ROUTES from "@/lib/constants/routes";

const HomePage = async () => {
	return redirect(ROUTES.DASHBOARD);
};

export default HomePage;
