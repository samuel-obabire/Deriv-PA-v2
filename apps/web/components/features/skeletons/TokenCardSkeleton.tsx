import { randomUUID } from "node:crypto";

const TokenCardItem = () => (
	<div className="flex flex-col rounded-xl border">
		<div className="flex items-center gap-3 border-b p-6">
			<div className="size-9 shrink-0 rounded-lg bg-muted animate-pulse" />
			<div className="min-w-0 space-y-2">
				<div className="h-3 w-24 rounded bg-muted animate-pulse" />
				<div className="h-2 w-12 rounded bg-muted animate-pulse" />
			</div>
		</div>
		<div className="flex items-center justify-between gap-2 px-6 py-4">
			<div className="h-2 w-20 rounded bg-muted animate-pulse" />
			<div className="h-8 w-20 rounded-md bg-muted animate-pulse" />
		</div>
	</div>
);

const TokenCardSkeleton = () => (
	<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
		{Array.from({ length: 4 }).map((_, i) => (
			<TokenCardItem key={randomUUID()} />
		))}
	</div>
);

export default TokenCardSkeleton;
