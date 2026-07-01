import { ImageOff } from "lucide-react";
import { cn } from "../../lib/utils";

export const KycReviewImagePlaceholder = ({ className }: { className?: string }) => (
	<div
		className={cn(
			"flex h-28 w-full flex-col items-center justify-center gap-1.5 rounded-md border border-dashed bg-muted/50",
			className,
		)}
	>
		<ImageOff className="size-5 text-muted-foreground/50" />
		<p className="text-xs text-muted-foreground/50">Not available</p>
	</div>
);

