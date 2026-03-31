import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
	private readonly logger = new Logger("HTTP");

	use(req: Request, res: Response, next: NextFunction) {
		const { method, originalUrl } = req;
		const startTime = Date.now();

		res.on("finish", () => {
			const { statusCode } = res;
			const contentLength = res.get("content-length");
			const responseTime = Date.now() - startTime;

			this.logger.log(
				`${method} ${originalUrl} ${statusCode} ${contentLength || 0}ms - ${responseTime}ms`,
			);

			this.logger.log(req.body);
		});

		next();
	}
}
