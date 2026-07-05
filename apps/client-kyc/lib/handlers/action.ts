import { UnauthorizedError } from "@repo/lib/errors";
import { type ZodType } from "zod";
import { auth } from "../auth";
import { getSession } from "../session";

type ActionProps<T> = {
	params: unknown;
	schema: ZodType<T>;
	authorize?: boolean;
};

const action = async <T>({
	params,
	schema,
	authorize = true,
}: ActionProps<T>) => {
	const parsedResult = schema.parse(params);

	let session: typeof auth.$Infer.Session | null = null;

	if (authorize) {
		session = await getSession();
		if (!session) throw new UnauthorizedError();
	}

	return { params: parsedResult, session };
};

export default action;
