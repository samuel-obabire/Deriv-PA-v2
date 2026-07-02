import { redirect } from "next/navigation";
import ROUTES from "@/lib/constants/routes";

const OrganizationPage = () => {
	return redirect(ROUTES.HOME);
};

export default OrganizationPage;
