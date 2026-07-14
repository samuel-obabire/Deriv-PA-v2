import { Loader2 } from "lucide-react";

import { cn } from "../../lib/utils";

type SpinnerProps = {
	className?: string;
};

export const Spinner = ({ className }: SpinnerProps) => (
	<Loader2
		className={cn("size-4 animate-spin text-muted-foreground", className)}
	/>
);
