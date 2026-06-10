import { PercentIcon, SettingsIcon } from "lucide-react";

import ROUTES from "@/lib/constants/routes";

import EmptyState from "./empty-state";

const RateNotConfigured = () => (
	<EmptyState
		icon={<PercentIcon className="size-6 text-muted-foreground" />}
		title="No rate configured"
		description="A currency rate hasn't been set for your organization yet."
		href={ROUTES.RATE_SETTINGS}
		linkIcon={<SettingsIcon className="size-4" />}
		linkLabel="Configure rate"
	/>
);

export default RateNotConfigured;
