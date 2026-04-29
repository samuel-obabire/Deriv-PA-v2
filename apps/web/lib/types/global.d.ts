type SuccessResponse<T = undefined> = {
	success: true;
	data?: T;
};

type ErrorResponse = {
	success: false;
	error?: {
		statusCode: number;
		message: string;
	};
};

type ActionResponse<T = undefined> = SuccessResponse<T> | ErrorResponse;

type ApiResponse<T = undefined> = NextResponse<ActionResponse<T>>;

export type SocketResponse<T = undefined> =
	| { success: true; data: T }
	| { success: false; error: { message: string } };
