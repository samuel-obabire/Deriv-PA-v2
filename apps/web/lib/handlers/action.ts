import { type ZodType } from "zod";
import { auth } from "../auth";
import { UnauthorizedError, ValidationError } from "../errors";
import { getSession } from "../session";

type ActionProps<T> = {
	params: unknown;
	schema: ZodType<T>;
	authorise?: boolean;
	requireActiveOrganization?: boolean;
};
const action = async <T>({
	params,
	schema,
	authorise = true,
	requireActiveOrganization = true,
}: ActionProps<T>) => {
	const parsedResult = schema.parse(params);

	let session: typeof auth.$Infer.Session | null = null;

	if (authorise) {
		session = await getSession();
	}

	if (!session && authorise) {
		throw new UnauthorizedError("You are not authorised");
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
