function unwrapDrizzleError(err: unknown): unknown {
	if (
		typeof err === "object" &&
		err !== null &&
		"cause" in err &&
		typeof (err as Record<string, unknown>).cause === "object"
	) {
		return (err as Record<string, unknown>).cause;
	}
	return err;
}

function getPgErrorCode(err: unknown): string | undefined {
	const pgErr = unwrapDrizzleError(err);
	if (typeof pgErr !== "object" || pgErr === null) return undefined;
	return (pgErr as Record<string, unknown>).code as string | undefined;
}

function getPgConstraintName(err: unknown): string | undefined {
	const pgErr = unwrapDrizzleError(err);
	if (typeof pgErr !== "object" || pgErr === null) return undefined;
	return (
		((pgErr as Record<string, unknown>).constraint_name as
			| string
			| undefined) ??
		((pgErr as Record<string, unknown>).constraint as string | undefined)
	);
}

export function isUniqueConstraintError(err: unknown): boolean {
	return getPgErrorCode(err) === "23505";
}

export function getUniqueConstraintName(err: unknown): string | undefined {
	if (!isUniqueConstraintError(err)) return undefined;
	return getPgConstraintName(err);
}
