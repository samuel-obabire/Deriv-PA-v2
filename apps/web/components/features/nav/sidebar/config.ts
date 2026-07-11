import {
	Banknote,
	BarChart3,
	Building2,
	ClipboardCheck,
	FileText,
	KeyRound,
	ShieldCheck,
	SlidersHorizontal,
	UserCheck,
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
				icon: Banknote,
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
				icon: BarChart3,
				permission: { resource: "ac", action: "read" },
			},
			{
				title: "Statement",
				href: ROUTES.STATEMENT,
				icon: FileText,
				permission: { resource: "statement", action: "view" },
			},
		],
	},
	{
		title: "Organization",
		items: [
			{
				title: "General",
				href: ROUTES.ORGANIZATION,
				icon: Building2,
				permission: { resource: "ac", action: "read" },
			},
			{
				title: "Members",
				href: ROUTES.ORGANIZATION_MEMBERS,
				icon: Users,
				permission: { resource: "member", action: "create" },
			},
			{
				title: "Access Requests",
				href: ROUTES.ACCESS_REQUESTS,
				icon: UserCheck,
				permission: { resource: "access_request", action: "view" },
			},
		],
	},
	{
		title: "KYC",
		items: [
			{
				title: "Invitations",
				href: ROUTES.KYC_INVITATIONS,
				icon: ClipboardCheck,
				permission: { resource: "kyc", action: "manage" },
			},
			{
				title: "Review",
				href: ROUTES.KYC,
				icon: ShieldCheck,
				permission: { resource: "kyc", action: "manage" },
			},
		],
	},
	{
		title: "Settings",
		items: [
			{
				title: "Rates",
				href: ROUTES.SETTINGS_RATES,
				icon: SlidersHorizontal,
				permission: { resource: "settings", action: "manage" },
			},
			{
				title: "Deriv Tokens",
				href: ROUTES.DERIV_TOKENS,
				icon: KeyRound,
				permission: { resource: "auth_provider", action: "manage" },
			},
		],
	},
];
