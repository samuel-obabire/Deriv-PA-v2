import { WsException } from "@nestjs/websockets";

export class AppWsException<TDetails = unknown> extends WsException {
	constructor(
		message: string,
		public readonly details?: TDetails,
	) {
		super(message);
	}
}
