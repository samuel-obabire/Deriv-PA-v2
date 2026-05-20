import { PercentIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import ROUTES from "@/lib/constants/routes";

const RateNotSet = () => (
	<div className="flex flex-col items-center justify-center gap-6 rounded-xl border border-dashed border-border bg-muted/30 px-6 py-14 text-center">
		<div className="flex size-14 items-center justify-center rounded-full bg-muted ring-1 ring-border">
			<PercentIcon className="size-6 text-muted-foreground" />
		</div>
		<div className="space-y-1.5">
			<p className="text-base font-medium text-foreground">
				No rate configured
			</p>
			<p className="text-sm text-muted-foreground">
				A currency rate hasn&apos;t been set for your organization yet.
			</p>
		</div>
		<Link
			href={ROUTES.RATE_SETTINGS}
			className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-transparent bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
		>
			<SettingsIcon className="size-4" />
			Configure rate
		</Link>
	</div>
);

export default RateNotSet;
