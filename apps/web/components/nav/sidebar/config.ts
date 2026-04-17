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
				roles: ["admin", "staff"],
			},
			{
				title: "Transfer Between Accounts",
				href: ROUTES.TRANSFER_INTERNAL,
				icon: ArrowLeftRight,
				roles: ["admin", "staff"],
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
				roles: ["admin"],
			},
			{
				title: "Summary",
				href: ROUTES.SUMMARY,
				icon: LayoutDashboard,
				roles: ["admin", "staff"],
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
				roles: ["admin"],
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
				roles: ["admin"],
			},
			{
				title: "Staff Management",
				href: ROUTES.ORGANIZATION_STAFF,
				icon: Users,
				roles: ["admin"],
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
				roles: ["admin"],
			},
		],
	},
];
