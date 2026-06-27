import Link from "next/link";
import { ReactNode } from "react";

interface EmptyStateProps {
	icon: ReactNode;
	title: string;
	description: string;
	href: string;
	linkIcon: ReactNode;
	linkLabel: string;
}

const EmptyState = ({
	icon,
	title,
	description,
	href,
	linkIcon,
	linkLabel,
}: EmptyStateProps) => (
	<div className="flex flex-col items-center justify-center gap-6 rounded-xl border border-dashed border-border bg-muted/30 px-6 py-14 text-center">
		<div className="flex size-14 items-center justify-center rounded-full bg-muted ring-1 ring-border">
			{icon}
		</div>
		<div className="space-y-1.5">
			<p className="text-base font-medium text-foreground">{title}</p>
			<p className="text-sm text-muted-foreground">{description}</p>
		</div>
		<Link
			href={href}
			className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-transparent bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
		>
			{linkIcon}
			{linkLabel}
		</Link>
	</div>
);

export { EmptyState };
