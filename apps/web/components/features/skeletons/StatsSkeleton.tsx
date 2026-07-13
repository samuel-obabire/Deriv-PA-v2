import { Card, CardContent } from "@repo/ui";

const StatsSkeleton = () => {
	return (
		<section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{Array.from({ length: 4 }).map(() => (
				<Card key={crypto.randomUUID()} className="w-full animate-pulse">
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="h-4 w-24 bg-muted-foreground/20 rounded" />
							<div className="h-5 w-5 bg-muted-foreground/20 rounded" />
						</div>

						<div className="h-8 w-28 bg-muted-foreground/20 rounded" />

						<div className="h-5 w-32 bg-muted-foreground/20 rounded" />
					</CardContent>
				</Card>
			))}
		</section>
	);
};

export default StatsSkeleton;
