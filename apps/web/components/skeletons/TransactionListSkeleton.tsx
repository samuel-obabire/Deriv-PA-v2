import { randomUUID } from "node:crypto";

type TransactionsListSkeletonProps = {
	count?: number;
};

export const TransactionsListSkeleton = ({
	count = 5,
}: TransactionsListSkeletonProps) => {
	return (
		<div className="space-y-4">
			{Array.from({ length: count }).map((_, i) => (
				<div
					key={randomUUID()}
					className="bg-muted border rounded-xl p-4 space-y-4 animate-pulse"
				>
					<div className="flex items-start justify-between">
						<div className="space-y-2">
							<div className="h-5 w-40 bg-muted-foreground/20 rounded-md" />
							<div className="h-3 w-52 bg-muted-foreground/10 rounded-md" />
						</div>

						<div className="h-6 w-20 bg-muted-foreground/20 rounded-md" />
					</div>

					<div className="flex justify-between items-end">
						<div className="space-y-2">
							<div className="h-3 w-24 bg-muted-foreground/10 rounded-md" />
							<div className="h-4 w-20 bg-muted-foreground/20 rounded-md" />
						</div>

						<div className="space-y-2 text-right">
							<div className="h-3 w-32 bg-muted-foreground/10 rounded-md ml-auto" />
							<div className="h-5 w-24 bg-muted-foreground/20 rounded-md ml-auto" />
						</div>
					</div>
				</div>
			))}
		</div>
	);
};
