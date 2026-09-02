import { DERIV_REQUEST_ID_NOT_FOUND } from "@repo/deriv";
import { HttpRequestError } from "src/http/http-client.service";

export const isRequestIdNotFoundError = (error: unknown): boolean =>
	error instanceof HttpRequestError &&
	error.message === DERIV_REQUEST_ID_NOT_FOUND;
