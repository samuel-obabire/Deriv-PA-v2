import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { orgTokenKey } from "@repo/deriv";
import { DerivOrgConnection } from "./deriv-org-connection";

type Connections = Map<string, DerivOrgConnection>;

@Injectable()
export class DerivOrgPoolService implements OnModuleDestroy {
	private readonly pool = new Map<string, Connections>();

	addToPool({
		orgId,
		tokenId,
		orgConnection,
	}: {
		tokenId: string;
		orgId: string;
		orgConnection: DerivOrgConnection;
	}) {
		const orgPool = this.pool.get(orgId);
		if (!orgPool) this.pool.set(orgId, new Map());

		this.pool.get(orgId).set(orgTokenKey(orgId, tokenId), orgConnection);
	}

	getOrganizationSocket(orgId: string, tokenId: string) {
		const clientSocket = this.pool.get(orgId)?.get(orgTokenKey(orgId, tokenId));
		if (!clientSocket) throw new WsException("Org socket not found");
		return clientSocket;
	}

	checkOrgExist(orgId: string, tokenId: string) {
		const clientSocket = this.pool.get(orgId)?.get(orgTokenKey(orgId, tokenId));

		return !!clientSocket;
	}

	onDrop(orgId: string) {
		this.pool.delete(orgId);
	}

	cleanOrganisationPool(orgId: string) {
		const orgPool = this.pool.get(orgId);

		// todo: clean only unused socket
		if (orgPool) {
			orgPool.forEach((socket) => {
				socket.disconnect();
			});
		}
	}

	onModuleDestroy() {
		this.pool.forEach((orgPool) => {
			orgPool.forEach((socket) => {
				socket.disconnect();
			});

			orgPool.clear();
		});

		this.pool.clear();
	}
}
