import { cn } from "../../lib/utils";

type Variant = "destructive" | "warning" | "info" | "success";

type Props = {
	title: string;
	message: string;
	variant?: Variant;
	className?: string;
};

const variantStyles: Record<Variant, string> = {
	destructive:
		"bg-destructive/10 border-destructive/30 text-destructive",
	warning:
		"bg-yellow-500/10 border-yellow-500/30 text-yellow-700 dark:text-yellow-400",
	info: "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400",
	success:
		"bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400",
};

export const Banner = ({ title, message, variant = "info", className }: Props) => {
	return (
		<div
			className={cn(
				"border rounded-md px-4 py-3 text-sm",
				variantStyles[variant],
				className,
			)}
		>
			<p className="font-semibold mb-1">{title}</p>
			<p>{message}</p>
		</div>
	);
};
