import "server-only";

import { UTApi } from "uploadthing/server";

const utapi = new UTApi({ defaultKeyType: "customId" });

export const getSignedUrl = async (key: string): Promise<string> => {
	const { ufsUrl } = await utapi.generateSignedURL(key);
	return ufsUrl;
};
