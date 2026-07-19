import { and, eq } from "drizzle-orm";
import { currency, InsertCurrency } from "../db/schema";
import { CURRENCY } from "../enums";
import { DB } from "../types";

const baseSelection = {
	id: currency.id,
	code: currency.code,
	label: currency.label,
	organizationId: currency.organizationId,
	createdAt: currency.createdAt,
	updatedAt: currency.updatedAt,
};

export const getAllOrganizationCurrencies = async (
	organizationId: string,
	db: DB,
) => {
	const currencies = await db
		.select(baseSelection)
		.from(currency)
		.where(eq(currency.organizationId, organizationId));

	return currencies;
};

type BaseOrganizationCurrency = {
	id: string;
	code: CURRENCY;
	label: string;
	organizationId: string;
	createdAt: Date;
	updatedAt: Date;
};

export function getOneOrganizationCurrency(
	args: {
		organizationId: string;
		currencyCode: string;
		options: { includeToken: true };
	},
	db: DB,
): Promise<BaseOrganizationCurrency & { token: string }>;
export function getOneOrganizationCurrency(
	args: {
		organizationId: string;
		currencyCode: string;
		options?: { includeToken?: false };
	},
	db: DB,
): Promise<BaseOrganizationCurrency>;
export async function getOneOrganizationCurrency(
	{
		organizationId,
		currencyCode,
		options,
	}: {
		organizationId: string;
		currencyCode: string;
		options?: {
			includeToken?: boolean;
		};
	},
	db: DB,
) {
	const selection = options?.includeToken
		? {
				...baseSelection,
				token: currency.token,
			}
		: baseSelection;

	const [fetchedCurrency] = await db
		.select(selection)
		.from(currency)
		.where(
			and(
				eq(currency.organizationId, organizationId),
				eq(currency.code, currencyCode as CURRENCY),
			),
		)
		.limit(1);

	if (!fetchedCurrency) {
		throw new Error(
			`Currency ${currencyCode} not found for org ${organizationId}`,
		);
	}

	return fetchedCurrency;
}

export const updateOrganizationCurrencyData = async (
	{
		organizationId,
		currencyCode,
		data,
	}: {
		organizationId: string;
		currencyCode: CURRENCY;
		data: { token: string };
	},
	db: DB,
) => {
	const [updatedCurrency] = await db
		.update(currency)
		.set(data)
		.where(
			and(
				eq(currency.organizationId, organizationId),
				eq(currency.code, currencyCode),
			),
		)
		.returning(baseSelection);

	if (!updatedCurrency)
		throw new Error(
			`Currency ${currencyCode} not found for org ${organizationId}`,
		);

	return updatedCurrency;
};

export const insertOrganizationCurrencyData = async (
	data: InsertCurrency,
	db: DB,
) => {
	const [insertedCurrency] = await db
		.insert(currency)
		.values(data)
		.returning(baseSelection);

	if (!insertedCurrency) throw new Error(`Unable to save data to database`);

	return insertedCurrency;
};

export const removeOrganizationCurrency = async (
	data: {
		organizationId: string;
		currencyCode: CURRENCY;
	},
	db: DB,
) => {
	const [deletedCurrency] = await db
		.delete(currency)
		.where(
			and(
				eq(currency.code, data.currencyCode),
				eq(currency.organizationId, data.organizationId),
			),
		)
		.returning();

	if (!deletedCurrency) throw new Error(`Record not found`);
};
