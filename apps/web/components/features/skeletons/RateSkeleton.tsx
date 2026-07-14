import { Card, CardContent, CardFooter } from "@repo/ui";

const RateSkeleton = () => {
	return (
		<Card className="w-full animate-pulse">
			<CardContent className="space-y-4">
				<div className="h-5 w-40 bg-muted rounded" />

				<div className="space-y-3">
					<div className="h-10 w-full bg-muted rounded" />
					<div className="h-10 w-full bg-muted rounded" />
				</div>
			</CardContent>

			<CardFooter>
				<div className="h-10 w-32 bg-muted rounded" />
			</CardFooter>
		</Card>
	);
};

export default RateSkeleton;
