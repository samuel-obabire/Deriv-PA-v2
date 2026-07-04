"use client";

import { Button, cn } from "@repo/ui";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
	variant?: React.ComponentProps<typeof Button>["variant"];
	size?: React.ComponentProps<typeof Button>["size"];
	className?: string;
	label?: string;
};

const RefreshButton = ({
	variant = "outline",
	size = "sm",
	className,
	label = "Refresh",
}: Props) => {
	const router = useRouter();

	return (
		<Button
			variant={variant}
			size={size}
			className={cn("gap-1.5", className)}
			onClick={() => router.refresh()}
		>
			<RefreshCw className="size-4" />
			{label}
		</Button>
	);
};

export default RefreshButton;
