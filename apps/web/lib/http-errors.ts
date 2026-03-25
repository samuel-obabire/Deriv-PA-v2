import { NextResponse } from "next/server";
import { RequestError } from "./errors";

export type ResponseType = "api" | "server";

const formatResponse = (
	responseType: ResponseType,
	statusCode: number,
	message: string,
) => {
	const errorResponse = {
		success: false,
		error: {
			statusCode,
			message,
		},
	};

	return responseType === "server"
		? errorResponse
		: NextResponse.json(errorResponse, { status: statusCode });
};

const handleError = (error: unknown, responseType: ResponseType = "server") => {
	if (error instanceof RequestError) {
		return formatResponse(responseType, error.statusCode, error.message);
	}

	if (error instanceof Error) {
		return formatResponse(responseType, 500, error.message);
	}

	return formatResponse(responseType, 500, "An unknown error occured");
};

export default handleError;
