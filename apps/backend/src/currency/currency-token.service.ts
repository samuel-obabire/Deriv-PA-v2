import { Injectable } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { currency } from "@repo/db";
import type { CURRENCY } from "@repo/db/enums";
import { decryptToken } from "@repo/utils";
import { and, eq } from "drizzle-orm";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class CurrencyTokenService {
	constructor(private readonly databaseService: DatabaseService) {}

	async getDecryptedOrgToken(orgId: string, tokenId: string): Promise<string> {
		const [orgCurrency] = await this.databaseService.client
			.select({ token: currency.token })
			.from(currency)
			.where(and(eq(currency.organizationId, orgId), eq(currency.id, tokenId)));

		if (!orgCurrency) throw new WsException("token not found");

		return decryptToken(orgCurrency.token);
	}

	async getTokenIdForCurrency(
		orgId: string,
		code: CURRENCY,
	): Promise<string | null> {
		const [orgCurrency] = await this.databaseService.client
			.select({ id: currency.id })
			.from(currency)
			.where(and(eq(currency.organizationId, orgId), eq(currency.code, code)));

		return orgCurrency?.id ?? null;
	}
}
