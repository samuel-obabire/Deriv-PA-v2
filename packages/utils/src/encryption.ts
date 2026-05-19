import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

function getKey(): Buffer {
	const raw = process.env.TOKEN_ENCRYPTION_KEY;
	if (!raw || !/^[0-9a-f]{64}$/.test(raw)) {
		throw new Error(
			"TOKEN_ENCRYPTION_KEY must be a 64-char lowercase hex string (32 bytes)",
		);
	}
	return Buffer.from(raw, "hex");
}

function serialize(iv: Buffer, authTag: Buffer, data: Buffer): string {
	return `${iv.toString("hex")}:${authTag.toString("hex")}:${data.toString("hex")}`;
}

function deserialize(input: string) {
	const parts = input.split(":");
	if (parts.length !== 3) throw new Error("Invalid ciphertext format");

	const [ivHex, authTagHex, dataHex] = parts as [string, string, string];
	const iv = Buffer.from(ivHex, "hex");
	const authTag = Buffer.from(authTagHex, "hex");
	const data = Buffer.from(dataHex, "hex");

	if (iv.length !== IV_LENGTH) throw new Error("Invalid IV length");
	if (authTag.length !== AUTH_TAG_LENGTH)
		throw new Error("Invalid auth tag length");

	return { iv, authTag, data };
}

export function encryptToken(plaintext: string): string {
	const key = getKey();
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
	const key = getKey();
	const { iv, authTag, data } = deserialize(ciphertext);
	const decipher = createDecipheriv(ALGORITHM, key, iv);
	decipher.setAuthTag(authTag);
	const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
	return decrypted.toString("utf8");
}
