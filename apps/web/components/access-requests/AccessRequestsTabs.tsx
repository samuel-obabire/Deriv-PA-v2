"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui";
import ActiveGrantsList, { type ActiveAccessGrant } from "./ActiveGrantsList";
import PendingRequestsList, {
	type PendingAccessRequest,
} from "./PendingRequestsList";

type Props = {
	pendingPromise: Promise<PendingAccessRequest[]>;
	activePromise: Promise<ActiveAccessGrant[]>;
};

const AccessRequestsTabs = ({ pendingPromise, activePromise }: Props) => {
	return (
		<Tabs defaultValue="pending" className="w-full">
			<TabsList>
				<TabsTrigger value="pending">Requests</TabsTrigger>
				<TabsTrigger value="active">Active Access</TabsTrigger>
			</TabsList>
			<TabsContent value="pending">
				<PendingRequestsList pendingPromise={pendingPromise} />
			</TabsContent>
			<TabsContent value="active">
				<ActiveGrantsList activePromise={activePromise} />
			</TabsContent>
		</Tabs>
	);
};

export default AccessRequestsTabs;
