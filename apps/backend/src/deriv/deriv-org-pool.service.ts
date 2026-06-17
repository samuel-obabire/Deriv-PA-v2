import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { orgTokenKey } from "@repo/deriv";
import { DerivOrgConnection } from "./deriv-org-connection";

type Connections = Map<string, DerivOrgConnection>;

@Injectable()
export class DerivOrgPoolService implements OnModuleDestroy {
	private readonly connectionPool = new Map<string, Connections>();

	addToPool({ orgId, tokenId }: { tokenId: string; orgId: string }) {
		const orgPool = this.pool.get(orgId);
		if (!orgPool) this.pool.set(orgId, new Map());

		const orgConnection = new DerivOrgConnection({
			orgId: orgId,
			onDrop: this.onDrop,
			tokenId,
		});

		this.pool.get(orgId).set(orgTokenKey(orgId, tokenId), orgConnection);

		return orgConnection;
	}

	get pool() {
		return this.connectionPool;
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

	onDrop(orgId: string, tokenId: string) {
		const orgPool = this.pool.get(orgId);
		if (!orgPool) return;
		orgPool.delete(orgTokenKey(orgId, tokenId));
		if (orgPool.size === 0) {
			this.pool.delete(orgId);
		}
	}

	evictOrgConnection(orgId: string, tokenId: string) {
		this.pool.get(orgId)?.get(orgTokenKey(orgId, tokenId))?.disconnect();
	}

	cleanOrganisationPool(orgId: string) {
		const orgPool = this.pool.get(orgId);
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
