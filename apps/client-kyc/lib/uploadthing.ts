import { createUploadthing, type FileRouter, UTFiles } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getSession } from "./session";

const f = createUploadthing();

export const uploadRouter: FileRouter = {
	kycDocument: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
		.middleware(async ({ files }) => {
			const session = await getSession();
			if (!session) throw new UploadThingError("Unauthorized");
			const customId = `kyc-doc-${session.user.id}-${crypto.randomUUID()}`;

			const fileOverrides = files.map((file) => {
				return {
					...file,
					customId: customId,
				};
			});

			return {
				[UTFiles]: fileOverrides,
			};
		})
		.onUploadComplete(({ file }) => ({ customId: file.customId })),

	kycSelfie: f({ video: { maxFileSize: "32MB", maxFileCount: 1 } })
		.middleware(async ({ files }) => {
			const session = await getSession();
			if (!session) throw new UploadThingError("Unauthorized");
			const customId = `kyc-selfie-${session.user.id}-${crypto.randomUUID()}`;

			const fileOverrides = files.map((file) => {
				return {
					...file,
					customId: customId,
				};
			});

			return {
				[UTFiles]: fileOverrides,
			};
		})
		.onUploadComplete(({ file }) => ({ customId: file.customId })),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
