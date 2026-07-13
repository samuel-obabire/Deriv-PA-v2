import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	Logger,
} from "@nestjs/common";
import { Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	private logger = new Logger(HttpExceptionFilter.name, { timestamp: true });

	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>(); // returns underlying platform response

		const status = exception.getStatus();
		const exceptionResponse = exception.getResponse();

		const error =
			typeof exceptionResponse === "string"
				? { message: exceptionResponse }
				: exceptionResponse;

		this.logger.error(`HttpException ${JSON.stringify(error)}`);

		response.status(status).json({ success: false, error });
	}
}
