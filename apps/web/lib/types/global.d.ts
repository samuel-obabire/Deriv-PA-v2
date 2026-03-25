type SuccessResponse<T = unknown> = {
	success: true;
	data: T;
};

type ErrorResponse = {
	success: false;
	error?: {
		statusCode: number;
		message: string;
	};
};

type ActionResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;
