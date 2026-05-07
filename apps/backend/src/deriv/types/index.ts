import { Socket } from "socket.io";

export type AuthPayload = {
	accessToken: string;
};

export interface AuthenticatedSocket extends Socket {
	data: {
		organizationId: string;
		userId: string;
		tokenId: string;
		permissions: Permissions[];
	};
}
