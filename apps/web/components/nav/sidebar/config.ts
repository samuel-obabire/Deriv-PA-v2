import {
	ArrowLeftRight,
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
			{
				title: "Transfer Between Accounts",
				href: ROUTES.TRANSFER_INTERNAL,
				icon: ArrowLeftRight,
				permission: { resource: "payment", action: "create" },
			},
		],
	},
	{
		title: "Reports",
		items: [
			{
				title: "Statement",
				href: ROUTES.STATEMENT,
				icon: FileText,
				permission: { resource: "ac", action: "read" },
			},
			{
				title: "Summary",
				href: ROUTES.SUMMARY,
				icon: LayoutDashboard,
				permission: { resource: "ac", action: "read" },
			},
		],
	},
	{
		title: "Settings",
		items: [
			{
				title: "Rate Settings",
				href: ROUTES.SETTINGS_RATES,
				icon: Settings,
				permission: { resource: "settings", action: "manage" },
			},
		],
	},
	{
		title: "Organization",
		items: [
			{
				title: "Organization Settings",
				href: ROUTES.ORGANIZATION,
				icon: Building2,
				permission: { resource: "organization", action: "update" },
			},
			{
				title: "Staff Management",
				href: ROUTES.ORGANIZATION_STAFF,
				icon: Users,
				permission: { resource: "member", action: "create" },
			},
		],
	},
	{
		title: "Authorization",
		items: [
			{
				title: "Authorize Deriv",
				href: ROUTES.AUTHORIZE_DERIV,
				icon: ShieldCheck,
				permission: { resource: "auth_provider", action: "manage" },
			},
		],
	},
];
