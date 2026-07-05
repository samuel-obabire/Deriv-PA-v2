import { UnauthorizedError, ValidationError } from "@repo/lib/errors";
import { type ZodType } from "zod";
import { auth } from "../auth";
import { getSession } from "../session";

type ActionProps<T> = {
	params: unknown;
	schema: ZodType<T>;
	authorize?: boolean;
	requireActiveOrganization?: boolean;
};
const action = async <T>({
	params,
	schema,
	authorize = true,
	requireActiveOrganization = true,
}: ActionProps<T>) => {
	const parsedResult = schema.parse(params);

	let session: typeof auth.$Infer.Session | null = null;

	if (authorize) {
		session = await getSession();
	}

	if (!session && authorize) {
		throw new UnauthorizedError("You are not authorized");
	}

	if (requireActiveOrganization) {
		if (session && !session.session.activeOrganizationId) {
			throw new ValidationError("No active organization selected.");
		}
	}

	return {
		params: parsedResult,
		session,
	};
};

export default action;
