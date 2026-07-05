const StatsSkeleton = () => {
	return (
		<section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{Array.from({ length: 4 }).map((_, i) => (
				<div
					key={crypto.randomUUID()}
					className="w-full rounded-xl border bg-muted p-5 space-y-4 animate-pulse"
				>
					<div className="flex items-center justify-between">
						<div className="h-4 w-24 bg-muted-foreground/20 rounded" />
						<div className="h-5 w-5 bg-muted-foreground/20 rounded" />
					</div>

					<div className="h-8 w-28 bg-muted-foreground/20 rounded" />

					<div className="h-5 w-32 bg-muted-foreground/20 rounded" />
				</div>
			))}
		</section>
	);
};

export default StatsSkeleton;
