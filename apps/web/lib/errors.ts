export class RequestError extends Error {
	statusCode: number;

	constructor(statusCode: number, message: string) {
		super(message);

		this.statusCode = statusCode;
		this.name = "RequestError";
	}
}

export class NotFoundError extends RequestError {
	constructor(resource: string, message?: string) {
		const msg = message ? message : `${resource} not found`;

		super(404, msg);

		this.name = "NotFoundError";
	}
}

export class UnauthorizedError extends RequestError {
	constructor(resource: string, message: string = "Unauthorized") {
		super(401, message);

		this.name = "UnauthorizedError";
	}
}

export class ForbiddenError extends RequestError {
	constructor(resource: string, message: string = "Forbidden") {
		super(403, message);

		this.name = "ForbiddenError";
	}
}
