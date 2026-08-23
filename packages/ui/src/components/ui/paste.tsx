"use client";

import { Check } from "lucide-react";
import { useState } from "react";

import { cn } from "../../lib/utils";

type Props = {
	onPaste: (value: string) => void;
	className?: string;
};

const Paste = ({ onPaste, className }: Props) => {
	const [pasted, setPasted] = useState(false);

	const handlePaste = async (e: React.MouseEvent | React.KeyboardEvent) => {
		e.stopPropagation();
		e.preventDefault();

		try {
			const text = await navigator.clipboard.readText();
			if (!text.trim()) return;

			onPaste(text.trim());
			setPasted(true);
			setTimeout(() => setPasted(false), 2000);
		} catch {
			// Clipboard read denied or unavailable; nothing to paste.
		}
	};

	return (
		<button
			type="button"
			tabIndex={0}
			aria-label="Paste from clipboard"
			className={cn(
				"inline-flex size-6   cursor-pointer items-center justify-center rounded-md text-muted-foreground opacity-60 transition-colors hover:bg-muted hover:text-foreground hover:opacity-100",
				className,
			)}
			onClick={handlePaste}
			onKeyDown={(e) => e.key === "Enter" && handlePaste(e)}
		>
			{pasted ? (
				<Check className="size-3.5 text-green-500" />
			) : ( <span className="text-16-medium font-bold">PASTE</span>
				
			)}
		</button>
	);
};

export { Paste };
