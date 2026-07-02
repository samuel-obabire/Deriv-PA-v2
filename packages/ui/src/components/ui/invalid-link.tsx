export const InvalidLink = ({ message }: { message: string }) => {
	return (
		<div className="min-h-screen flex items-center justify-center p-6">
			<div className="max-w-sm text-center space-y-3">
				<h1 className="text-xl font-semibold">Link invalid</h1>
				<p className="text-sm text-muted-foreground">{message}</p>
			</div>
		</div>
	);
};
