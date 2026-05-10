import { Permissions } from "@repo/utils";

export type DecodedJwtAccessToken = {
	sub: string;
	permissions: Permissions[];
	version: string;
	organizationId: string;
	tokenId: string;
};
