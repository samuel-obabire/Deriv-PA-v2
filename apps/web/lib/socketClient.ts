import {
	createPromise,
	DerivEndpointName,
	DerivRequestPayload,
	DerivResponseData,
	DerivSocketEvent,
	DerivSubcriptionEndpoint,
} from "@repo/deriv";
import { Socket } from "socket.io-client";
import { SocketResponse } from "../types/global";

type Listener<T> = (data: T) => void;

type TransferFundsPayload = {
	data: DerivRequestPayload<"paymentagent_transfer">;
	options: { idempotencyKey: string; ignoreDuplicatePayment?: boolean };
};

type ValidateTransferPayload = {
	data: DerivRequestPayload<"paymentagent_transfer">;
	options: { ignoreDuplicatePayment?: boolean };
};

type ValidateClientNamePayload = {
	data: DerivRequestPayload<"paymentagent_transfer"> & { dry_run: 1 };
};

class SocketClient {
	private subscriptions = new Map<
		DerivSubcriptionEndpoint,
		Set<Listener<any>>
	>();

	private socketHandlers = new Map<
		DerivSubcriptionEndpoint,
		(data: any) => void
	>();

	constructor(private socket: Socket) {}

	private rawRequest<R>(event: string, data: object): Promise<R> {
		const { promise, reject, resolve } = createPromise();

		const onDisconnect = () => reject(new Error("Socket disconnected"));
		this.socket.once("disconnect", onDisconnect);

		this.socket.emit(event, data, (response: SocketResponse) => {
			this.socket.off("disconnect", onDisconnect);
			if (!response.success) {
				reject(new Error(response.error.message));
			} else {
				resolve(response.data);
			}
		});

		return promise as Promise<R>;
	}

	private request<
		T extends DerivEndpointName,
		P extends object = DerivRequestPayload<T>,
	>(event: T, data: P) {
		return this.rawRequest<DerivResponseData<T>>(event, data);
	}

	async subscribe<T extends DerivSubcriptionEndpoint>(
		event: T,
		payload: DerivRequestPayload<T>,
		cb: Listener<DerivResponseData<T>>,
	) {
		const cleanup = this.on<T>(event, cb);

		try {
			const res = await this.request(event, payload);
			return [res, cleanup] as const;
		} catch (err) {
			cleanup?.();
			throw err;
		}
	}

	on<T extends DerivSubcriptionEndpoint>(
		event: T,
		cb: Listener<DerivResponseData<T>>,
	) {
		if (!this.subscriptions.has(event)) {
			this.subscriptions.set(event, new Set());
		}

		const listeners = this.subscriptions.get(event);
		if (!listeners) return;

		listeners.add(cb);

		// attach socket listener once
		if (!this.socketHandlers.has(event)) {
			const handler = (data: DerivResponseData<T>) => {
				this.subscriptions.get(event)?.forEach((cb) => {
					cb(data);
				});
			};

			this.socketHandlers.set(event, handler);
			this.socket.on(event as string, handler);
		}

		return () => {
			const listeners = this.subscriptions.get(event);
			listeners?.delete(cb);

			if (listeners && listeners.size === 0) {
				this.subscriptions.delete(event);

				const handler = this.socketHandlers.get(event);
				if (handler) {
					this.socket.off(event as string, handler);
					this.socketHandlers.delete(event);
				}
			}
		};
	}

	dispose() {
		for (const [event, handler] of this.socketHandlers) {
			this.socket.off(event as string, handler);
		}
		this.socketHandlers.clear();
		this.subscriptions.clear();
	}

	validateTransfer(
		data: DerivRequestPayload<"paymentagent_transfer">,
		options: { ignoreDuplicatePayment?: boolean } = {},
	) {
		return this.rawRequest<DerivResponseData<"paymentagent_transfer">>(
			DerivSocketEvent.ValidateTransfer,
			{ data, options } satisfies ValidateTransferPayload,
		);
	}

	validateClientName(data: ValidateClientNamePayload["data"]) {
		return this.rawRequest<DerivResponseData<"paymentagent_transfer">>(
			DerivSocketEvent.ValidateClientName,
			{ data },
		);
	}

	transferFunds(
		data: DerivRequestPayload<"paymentagent_transfer">,
		options: { idempotencyKey: string; ignoreDuplicatePayment?: boolean },
	) {
		return this.request<"paymentagent_transfer", TransferFundsPayload>(
			DerivSocketEvent.TransferFunds,
			{ data, options },
		);
	}

	getStatement(data: DerivRequestPayload<"statement">) {
		return this.request(DerivSocketEvent.Statement, data);
	}

	authorize(data: DerivRequestPayload<"authorize">) {
		return this.request(DerivSocketEvent.Authorize, data);
	}

	async subscribeBalance(onData: Listener<DerivResponseData<"balance">>) {
		const [, cleanup] = await this.subscribe(
			DerivSocketEvent.Balance,
			{
				subscribe: 1,
				balance: 1,
				account: "current",
			} satisfies DerivRequestPayload<"balance">,
			(balance) => {
				onData(balance);
			},
		);

		return cleanup;
	}
}

export default SocketClient;
