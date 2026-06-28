import type { NextResponse } from "next/server";

export type SuccessResponse<T = undefined> = {
	success: true;
	data?: T;
};

export type ErrorResponse = {
	success: false;
	error?: {
		statusCode: number;
		message: string;
	};
};

export type ActionResponse<T = undefined> = SuccessResponse<T> | ErrorResponse;

export type ApiResponse<T = undefined> = NextResponse<ActionResponse<T>>;
