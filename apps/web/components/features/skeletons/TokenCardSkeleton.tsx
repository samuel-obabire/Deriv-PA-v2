import { randomUUID } from "node:crypto";
import { Card, CardFooter, CardHeader } from "@repo/ui";

const TokenCardItem = () => (
	<Card className="flex flex-col">
		<CardHeader className="border-b">
			<div className="flex items-center gap-3">
				<div className="size-9 shrink-0 rounded-lg bg-muted animate-pulse" />
				<div className="min-w-0 space-y-2">
					<div className="h-3 w-24 rounded bg-muted animate-pulse" />
					<div className="h-2 w-12 rounded bg-muted animate-pulse" />
				</div>
			</div>
		</CardHeader>
		<CardFooter className="flex items-center justify-between gap-2">
			<div className="h-2 w-20 rounded bg-muted animate-pulse" />
			<div className="h-8 w-20 rounded-md bg-muted animate-pulse" />
		</CardFooter>
	</Card>
);

const TokenCardSkeleton = () => (
	<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
		{Array.from({ length: 4 }).map((_, i) => (
			<TokenCardItem key={randomUUID()} />
		))}
	</div>
);

export default TokenCardSkeleton;
