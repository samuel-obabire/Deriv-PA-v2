const RouteLoading = () => {
	return (
		<div className="h-screen w-full flex flex-col items-center justify-center gap-6 animate-pulse">
			<div className="h-10 w-10 rounded-full border-4 border-muted border-t-primary animate-spin" />
		</div>
	);
};

export default RouteLoading;
