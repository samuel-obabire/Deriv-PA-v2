export const KycReviewField = ({
	label,
	value,
}: {
	label: string;
	value: string;
}) => (
	<div>
		<p className="text-xs text-muted-foreground">{label}</p>
		<p className="mt-0.5 text-sm font-medium">{value}</p>
	</div>
);

