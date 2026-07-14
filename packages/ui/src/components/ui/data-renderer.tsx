type DataRendererProps<T> = {
	data: T | null | undefined;
	error?: unknown;
	errorComponent?: React.ReactNode;
	empty?: {
		title?: string;
		message?: string;
		action?: React.ReactNode;
		component?: React.ReactNode;
	};
	render: (data: NonNullable<T>) => React.ReactNode;
};

export const DataRenderer = <T,>({
	data,
	error,
	errorComponent,
	empty,
	render,
}: DataRendererProps<T>) => {
	if (error) {
		return (
			errorComponent ?? (
				<div className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-muted/30 px-6 py-14 text-center">
					<p className="text-sm font-medium text-destructive">
						Something went wrong.
					</p>
				</div>
			)
		);
	}

	if (!data || (Array.isArray(data) && data.length === 0)) {
		return (
			<div className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-muted/30 px-6 py-14 text-center">
				{empty?.component ? (
					empty.component
				) : (
					<p className="text-sm font-medium text-foreground">
						{empty?.title ?? "No records yet"}
					</p>
				)}
				{empty?.message && (
					<p className="text-sm text-muted-foreground">{empty.message}</p>
				)}
				{empty?.action && <div className="mt-2">{empty.action}</div>}
			</div>
		);
	}

	return <>{render(data )}</>;
};
