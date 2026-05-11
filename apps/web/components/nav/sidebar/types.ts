import { LucideIcon } from "lucide-react";

import { Statements } from "@/lib/permissions";

export type SidebarItem = {
	title: string;
	href: string;
	icon?: LucideIcon;
	permission: SidebarPermission;
};

export type SidebarGroup = {
	title: string;
	items: SidebarItem[];
	defaultOpen?: boolean;
};

export type SidebarPermission = {
	[K in keyof Statements]: { resource: K; action: Statements[K][number] };
}[keyof Statements];
