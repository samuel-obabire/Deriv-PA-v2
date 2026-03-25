import pino from "pino";
import { serverEnv } from "@/lib/validations/server";

const isProduction = serverEnv.NODE_ENV === "production";

const logger = pino({
	level: isProduction ? "info" : "debug",
	transport: {
		target: isProduction ? "pino" : "pino-pretty",
		options: {
			colorize: !isProduction,
			translateTime: "SYS:standard",
			ignore: "pid,hostname",
		},
	},
});

export default logger;
