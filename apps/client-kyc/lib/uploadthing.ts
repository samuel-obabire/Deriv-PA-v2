import { createUploadthing, type FileRouter, UTFiles } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getSession } from "./session";

const f = createUploadthing();

const kycMiddleware =
	(prefix: string) =>
	async ({
		files,
	}: {
		files: readonly { name: string; size: number; type: string }[];
	}) => {
		const session = await getSession();
		if (!session) throw new UploadThingError("Unauthorized");

		const customId = `kyc-${prefix}-${session.user.id}-${crypto.randomUUID()}`;
		return { [UTFiles]: files.map((file) => ({ ...file, customId })) };
	};

export const uploadRouter: FileRouter = {
	kycDocument: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
		.middleware(kycMiddleware("doc"))
		.onUploadComplete(({ file }) => ({ customId: file.customId })),

	kycSelfie: f({ video: { maxFileSize: "64MB", maxFileCount: 1 } })
		.middleware(kycMiddleware("selfie"))
		.onUploadComplete(({ file }) => ({ customId: file.customId })),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
