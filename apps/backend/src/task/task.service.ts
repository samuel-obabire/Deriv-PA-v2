import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { DerivOrgPoolService } from "src/deriv/deriv-org-pool.service";
import { DerivGateway } from "src/deriv-gateway/deriv.gateway";

@Injectable()
export class TasksService {
	constructor(
		private readonly derivPool: DerivOrgPoolService,
		private readonly derivGateway: DerivGateway,
	) {}

	@Cron(CronExpression.EVERY_5_MINUTES, {
		name: "idle-job-cleaner",
	})
	sweepIdleConnections() {
		const now = Date.now();

		this.derivPool.pool.forEach((orgConnections) => {
			orgConnections.forEach((d) => {
				const idleMs = now - d.socketLastUsedAt;

				// close connections idle for at least 10 mins
				if (idleMs > 10 * 60 * 1000) {
					this.derivGateway.evictIdleOrgConnection(d.orgId, d.tokenId);
				}
			});
		});
	}
}
