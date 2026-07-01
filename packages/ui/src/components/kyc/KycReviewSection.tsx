export const KycReviewSection = ({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) => (
	<div className="space-y-3">
		<h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
			{title}
		</h3>
		{children}
	</div>
);

