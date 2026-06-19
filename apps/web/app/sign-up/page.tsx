import { redirect } from "next/navigation";
import ROUTES from "@/lib/constants/routes";

const SignUpPage = () => redirect(ROUTES.SIGN_IN);

export default SignUpPage;
