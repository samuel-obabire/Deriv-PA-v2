import { ArgumentsHost, Catch, Logger } from "@nestjs/common";
import { BaseWsExceptionFilter, WsException } from "@nestjs/websockets";
import { ZodValidationException } from "nestjs-zod";
import { Socket } from "socket.io";

type WsErrorResponse = {
	success: false;
	error: { message: string } | Record<string, unknown>;
};

@Catch(WsException, ZodValidationException)
export class WsExceptionFilter extends BaseWsExceptionFilter {
	private readonly logger = new Logger(WsExceptionFilter.name);

	catch(exception: WsException | ZodValidationException, host: ArgumentsHost) {
		const client = host.switchToWs().getClient() as Socket;
		const args = host.getArgs();

		let error: WsErrorResponse["error"];
		if (exception instanceof ZodValidationException) {
			error = {
				message: "Validation failed",
				errors: (exception.getZodError() as { errors: unknown[] }).errors,
			};
		} else {
			const rawError = exception.getError();
			error =
				typeof rawError === "string"
					? { message: rawError }
					: (rawError as Record<string, unknown>);
		}

		this.logger.error(`WsException [${client.id}]: ${JSON.stringify(error)}`);

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
