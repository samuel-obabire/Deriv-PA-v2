export class SocketRequestError<TDetails = unknown> extends Error {
	constructor(
		message: string,
		public readonly details?: TDetails,
	) {
		super(message);
		this.name = "SocketRequestError";
	}
}
