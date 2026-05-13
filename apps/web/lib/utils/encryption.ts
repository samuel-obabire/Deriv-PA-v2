import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { serverEnv } from "@/lib/validations/env/server";

const ALGORITHM = "aes-256-gcm";

const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

const key = Buffer.from(serverEnv.TOKEN_ENCRYPTION_KEY, "hex");

if (key.length !== 32) {
	throw new Error("TOKEN_ENCRYPTION_KEY must be 32 bytes (64 hex chars)");
}

function serialize(iv: Buffer, authTag: Buffer, data: Buffer) {
	return `${iv.toString("hex")}:${authTag.toString(
		"hex",
	)}:${data.toString("hex")}`;
}

function deserialize(input: string) {
	const parts = input.split(":");

	if (parts.length !== 3) {
		throw new Error("Invalid ciphertext format");
	}

	const [ivHex, authTagHex, dataHex] = parts as [string, string, string];

	const iv = Buffer.from(ivHex, "hex");
	const authTag = Buffer.from(authTagHex, "hex");
	const data = Buffer.from(dataHex, "hex");

	if (iv.length !== IV_LENGTH) {
		throw new Error("Invalid IV length");
	}

	if (authTag.length !== AUTH_TAG_LENGTH) {
		throw new Error("Invalid auth tag length");
	}

	return { iv, authTag, data };
}

export function encryptToken(plaintext: string): string {
	const iv = randomBytes(IV_LENGTH);

	const cipher = createCipheriv(ALGORITHM, key, iv);

	const encrypted = Buffer.concat([
		cipher.update(plaintext, "utf8"),
		cipher.final(),
	]);

	const authTag = cipher.getAuthTag();

	return serialize(iv, authTag, encrypted);
}

export function decryptToken(ciphertext: string): string {
	const { iv, authTag, data } = deserialize(ciphertext);

	const decipher = createDecipheriv(ALGORITHM, key, iv);

	decipher.setAuthTag(authTag);

	const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);

	return decrypted.toString("utf8");
}
