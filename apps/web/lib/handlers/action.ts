import z, { type ZodType } from "zod";
import { auth } from "../auth";
import { UnauthorizedError } from "../errors";
import { getSession } from "../session";

type ActionProps<T> = {
	params: T;
	schema: ZodType<any>;
	authorise?: boolean;
};
const action = async <T>({
	params,
	schema,
	authorise = true,
}: ActionProps<T>) => {
	const parsedResult = schema.parse(params);

	let session: typeof auth.$Infer.Session | null = null;

	if (authorise) {
		session = await getSession();
	}

	if (!session && authorise) {
		throw new UnauthorizedError("You are not authorised");
	}

	return { params: parsedResult as z.infer<typeof schema>, session };
};

export default action;
