const AccountSkeleton = () => {
	return (
		<section className="space-y-4">
			<div className="rounded-2xl border p-4 space-y-4">
				<div className="flex items-center gap-4">
					<div className="w-12 h-12 rounded-full bg-muted animate-pulse shrink-0" />

					<div className="flex-1 space-y-2">
						<div className="h-3 w-35 bg-muted rounded animate-pulse" />
						<div className="h-2 w-45 bg-muted rounded animate-pulse" />
					</div>
				</div>

				<div className="space-y-2">
					<div className="h-2 w-full bg-muted rounded animate-pulse" />
					<div className="h-2 w-[90%] bg-muted rounded animate-pulse" />
				</div>
			</div>
		</section>
	);
};

export default AccountSkeleton;
