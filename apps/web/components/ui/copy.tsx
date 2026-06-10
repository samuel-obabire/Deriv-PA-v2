"use client";

import { Check, Copy as CopyIcon } from "lucide-react";
import { type PropsWithChildren, useState } from "react";

import { cn } from "@/lib/utils";

type Props = PropsWithChildren<{
	value: string;
	className?: string;
}>;

const Copy = ({ value, children, className }: Props) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = async (e: React.MouseEvent | React.KeyboardEvent) => {
		e.stopPropagation();
		await navigator.clipboard.writeText(value);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<span
			role="button"
			tabIndex={0}
			className={cn("inline-flex cursor-pointer items-center gap-1", className)}
			onClick={handleCopy}
			onKeyDown={(e) => e.key === "Enter" && handleCopy(e)}
		>
			{children}
			{copied ? (
				<Check className="size-3 text-green-500" />
			) : (
				<CopyIcon className="size-3 text-muted-foreground opacity-60" />
			)}
		</span>
	);
};

export default Copy;
