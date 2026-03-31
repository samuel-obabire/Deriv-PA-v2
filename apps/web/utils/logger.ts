import { isProduction } from "better-auth";
import pino from "pino";
import { serverEnv } from "@/lib/validations/env/server";

const isDevelopment = serverEnv.NODE_ENV === "development";

const logger = pino({
	level: isProduction ? "info" : "debug",
	transport: isDevelopment
		? {
				target: "pino-pretty",
				options: {
					colorize: true,
					ignore: "pid,hostname",
					translateTime: "SYS:standard",
				},
			}
		: undefined,
});

export default logger;
