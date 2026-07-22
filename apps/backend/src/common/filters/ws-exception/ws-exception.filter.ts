import { ArgumentsHost, Catch, HttpException, Logger } from "@nestjs/common";
import { BaseWsExceptionFilter, WsException } from "@nestjs/websockets";
import { ZodValidationException } from "nestjs-zod";
import { AppWsException } from "src/common/exceptions/app-ws.exception";
import type { AuthenticatedSocket } from "src/deriv/types";

type WsErrorResponse = {
	success: false;
	error: { message: string; details?: unknown } | Record<string, unknown>;
};

@Catch()
export class WsExceptionFilter extends BaseWsExceptionFilter {
	private readonly logger = new Logger(WsExceptionFilter.name, {
		timestamp: true,
	});

	catch(exception: unknown, host: ArgumentsHost) {
		const client = host.switchToWs().getClient() as AuthenticatedSocket;
		const args = host.getArgs();

		let error: WsErrorResponse["error"];
		if (exception instanceof ZodValidationException) {
			error = {
				message: "Validation failed",
				errors: (exception.getZodError() as { errors: unknown[] }).errors,
			};
		} else if (exception instanceof AppWsException) {
			error = {
				message: exception.message,
				...(exception.details !== undefined
					? { details: exception.details }
					: {}),
			};
		} else if (exception instanceof WsException) {
			const rawError = exception.getError();
			error =
				typeof rawError === "string"
					? { message: rawError }
					: (rawError as Record<string, unknown>);
		} else if (exception instanceof HttpException) {
			const rawError = exception.getResponse();
			error =
				typeof rawError === "string"
					? { message: rawError }
					: (rawError as Record<string, unknown>);
		} else if (exception instanceof Error) {
			error = { message: "Something went wrong." };
		} else {
			error = { message: "Internal server error" };
		}

		const { organizationId, tokenId } = client.data ?? {};

		this.logger.error(
			`WsException [${client.id}] org=${organizationId} tokenId=${tokenId}: ${JSON.stringify(error)}`,
		);

		const payload: WsErrorResponse = { success: false, error };

		const ack = args.find(
			(arg): arg is (...a: unknown[]) => void => typeof arg === "function",
		);

		if (ack) {
			ack(payload);
		} else {
			client.emit("exception", payload);
		}
	}
}
