import { WsException } from "@nestjs/websockets";
import {
	createPromise,
	DerivEndpointName,
	DerivError,
	DerivRequestPayload,
	DerivResponseData,
	DerivSubcriptionEndpoint,
	hashPayload,
	RequestHandler,
	SubscriptionHandler,
} from "@repo/deriv";
import WebSocket from "ws";

export class DerivOrgConnection {
	private websocket: WebSocket;
	private reqId = 0;
	private keepAliveIntervalId: NodeJS.Timeout | null = null;
	private keepAliveInterval = 30000;
	private waitForSocketOpen = createPromise<void>();
	readonly orgId: string;
	readonly tokenId: string;
	private lastUsedAt: number;

	private requestHandlers = new Map<string, RequestHandler>();
	private subscriptionHandlers = new Map<string, SubscriptionHandler>();

	private onDrop: (orgId: string, tokenId: string) => void;

	constructor({
		onDrop,
		orgId,
		tokenId,
	}: {
		orgId: string;
		onDrop: (orgId: string, tokenId: string) => void;
		tokenId: string;
	}) {
		this.orgId = orgId;
		this.tokenId = tokenId;
		this.onDrop = onDrop;
		this.lastUsedAt = Date.now();

		this.websocket = new WebSocket(
			"wss://ws.derivws.com/websockets/v3?app_id=71728",
		);

		this.websocket.addEventListener("open", (_e) => {
			// resolve open promise

			this.waitForSocketOpen.resolve();
		});

		this.websocket.addEventListener("close", (_e) => {
			this.cleanup();
		});

		this.websocket.addEventListener("message", (response) => {
			const parsedData = JSON.parse(
				response.data.toString(),
			) as DerivResponseData & { subscription?: { id: string } };

			if (parsedData.subscription || parsedData.echo_req?.subscribe) {
				const { req_id, ...payload } = parsedData.echo_req;
				const subscribeHash = hashPayload(payload);

				const matchingHandler = this.subscriptionHandlers.get(subscribeHash);
				if (!matchingHandler) return;

				if (parsedData.error) {
					this.subscriptionHandlers.delete(subscribeHash);
					matchingHandler.onError(new WsException(parsedData.error));
					return;
				}

				matchingHandler.data = parsedData;
				matchingHandler.onData(parsedData);
				matchingHandler.subscriptionId = parsedData.subscription?.id;
			} else if (parsedData) {
				const reqId = parsedData.req_id.toString();
				const matchingHandler = this.requestHandlers.get(reqId);
				if (!matchingHandler) return;

				if (parsedData.error) {
					matchingHandler.onError(new WsException(parsedData.error));
				} else {
					matchingHandler.onData(parsedData);
				}
				this.requestHandlers.delete(reqId);
			}
		});

		this.keepAlive();
	}

	async send<T extends DerivEndpointName>(args: {
		name: T;
		payload: DerivRequestPayload<T>;
	}): Promise<DerivResponseData<T>> {
		this.markUsed();
		return this.dispatch(args);
	}

	private async dispatch<T extends DerivEndpointName>({
		payload,
	}: {
		name: T;
		payload: DerivRequestPayload<T>;
	}): Promise<DerivResponseData<T>> {
		this.reqId++;
		const reqId = this.reqId;

		const { promise, resolve, reject } = createPromise<
			DerivResponseData<T>,
			DerivError
		>();

		this.requestHandlers.set(reqId.toString(), {
			onData: (data) => resolve(data as DerivResponseData<T>),
			onError: (e) => reject(e as DerivError),
		});

		await this.waitForSocketOpen.promise;

		if (this.websocket.readyState !== WebSocket.OPEN) {
			this.requestHandlers.delete(reqId.toString());
			throw new WsException("Event loop closed. Please retry your request");
		}

		this.websocket.send(JSON.stringify({ ...payload, req_id: reqId }));

		return promise;
	}

	async subscribe<T extends DerivSubcriptionEndpoint>({
		name,
		payload,
		onData,
		onError,
	}: {
		name: T;
		payload: DerivRequestPayload<T>;
		onData: (data: DerivResponseData<T>) => void;
		onError: (error: unknown) => void;
	}) {
		const subscriptionHash = hashPayload(payload);
		const matchingHandler = this.subscriptionHandlers.get(subscriptionHash);

		// checking if there's already a subscription
		if (matchingHandler) {
			onData(matchingHandler.data as DerivResponseData<T>);
			return;
		} else {
			this.reqId = this.reqId + 1;

			const newSubscriptionHandler: SubscriptionHandler<T> = {
				onData: onData,
				onError: onError,
				subscriptionName: name,
			};

			this.subscriptionHandlers.set(subscriptionHash, newSubscriptionHandler);

			// don't await subscription call. otherwise it will never resolve
			this.send({
				name: name,
				payload: { req_id: this.reqId, ...payload },
			});
		}
	}

	private keepAlive() {
		if (this.keepAliveIntervalId) clearInterval(this.keepAliveIntervalId);

		const intervalId = setInterval(async () => {
			this.reqId = this.reqId + 1;

			await this.dispatch({
				name: "ping",
				payload: {
					ping: 1,
				},
			});
		}, this.keepAliveInterval);

		this.keepAliveIntervalId = intervalId;
	}

	isSocketClosingOrClosed() {
		return [2, 3].includes(this.websocket.readyState);
	}

	markUsed() {
		this.lastUsedAt = Date.now();
	}

	get socketLastUsedAt() {
		return this.lastUsedAt;
	}

	disconnect() {
		if (!this.isSocketClosingOrClosed()) this.websocket.close();

		this.cleanup();
	}

	private cleanup() {
		clearInterval(this.keepAliveIntervalId);

		this.requestHandlers.clear();
		this.subscriptionHandlers.clear();
		this.onDrop(this.orgId, this.tokenId);
	}
}
