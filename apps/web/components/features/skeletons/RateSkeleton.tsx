const RateSkeleton = () => {
	return (
		<div className="rounded-2xl border p-4 animate-pulse space-y-4">
			<div className="h-5 w-40 bg-muted rounded" />

			<div className="space-y-3">
				<div className="h-10 w-full bg-muted rounded" />
				<div className="h-10 w-full bg-muted rounded" />
			</div>

			<div className="h-10 w-32 bg-muted rounded" />
		</div>
	);
};

export default RateSkeleton;
