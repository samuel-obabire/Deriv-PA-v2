import { APIError } from "better-auth";
import { NextResponse } from "next/server";
import z, { ZodError } from "zod";
import { RequestError, ValidationError } from "./errors";
import logger from "./logger";
import type { ApiResponse, ErrorResponse } from "./types";

export type ResponseType = "api" | "server";

const formatResponse = (
	responseType: ResponseType,
	statusCode: number,
	message: string,
): ApiResponse | ErrorResponse => {
	const errorResponse: ErrorResponse = {
		success: false,
		error: {
			statusCode,
			message,
		},
	};

	return responseType === "server"
		? errorResponse
		: (NextResponse.json(errorResponse, {
				status: statusCode,
			}) as unknown as ApiResponse);
};

function handleError(error: unknown, responseType: "api"): ApiResponse;
function handleError(error: unknown, responseType?: "server"): ErrorResponse;
function handleError(
	error: unknown,
	responseType: ResponseType = "server",
): ApiResponse | ErrorResponse {
	logger.error(error);

	if (error instanceof ZodError) {
		const validationError = new ValidationError(z.prettifyError(error));

		return formatResponse(
			responseType,
			validationError.statusCode,
			validationError.message,
		);
	}

	if (error instanceof APIError) {
		return formatResponse(responseType, error.statusCode, error.message);
	}

	if (error instanceof RequestError) {
		return formatResponse(responseType, error.statusCode, error.message);
	}

	if (error instanceof Error) {
		return formatResponse(responseType, 500, error.message);
	}

	return formatResponse(responseType, 500, "An unknown error occured");
}

export default handleError;
