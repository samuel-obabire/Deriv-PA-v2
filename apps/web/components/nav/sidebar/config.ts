import {
	ArrowRightLeft,
	Building2,
	FileText,
	LayoutDashboard,
	Settings,
	ShieldCheck,
	Users,
} from "lucide-react";
import ROUTES from "@/lib/constants/routes";
import { SidebarGroup } from "./types";

export const sidebarConfig: SidebarGroup[] = [
	{
		title: "Transactions",
		defaultOpen: true,
		items: [
			{
				title: "Transfer to Client",
				href: ROUTES.TRANSFER_CLIENT,
				icon: ArrowRightLeft,
				permission: { resource: "payment", action: "create" },
			},
		],
	},
	{
		title: "Reports",
		items: [
			{
				title: "Summary",
				href: ROUTES.SUMMARY,
				icon: LayoutDashboard,
				permission: { resource: "ac", action: "read" },
			},
			{
				title: "Statement",
				href: ROUTES.STATEMENT,
				icon: FileText,
				permission: { resource: "ac", action: "read" },
			},
		],
	},
	{
		title: "Settings",
		items: [
			{
				title: "Organization",
				href: ROUTES.ORGANIZATION,
				icon: Building2,
				permission: { resource: "ac", action: "read" },
			},
			{
				title: "Organization Members",
				href: ROUTES.ORGANIZATION_MEMBERS,
				icon: Users,
				permission: { resource: "member", action: "create" },
			},
			{
				title: "Rate Management",
				href: ROUTES.SETTINGS_RATES,
				icon: Settings,
				permission: { resource: "settings", action: "manage" },
			},
			{
				title: "Deriv Tokens",
				href: ROUTES.DERIV_TOKENS,
				icon: ShieldCheck,
				permission: { resource: "auth_provider", action: "manage" },
			},
		],
	},
];
