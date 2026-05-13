import { LucideIcon } from "lucide-react";
import { ResourcePermission } from "@/lib/permissions";

export type SidebarItem = {
	title: string;
	href: string;
	icon?: LucideIcon;
	permission: ResourcePermission;
};

export type SidebarGroup = {
	title: string;
	items: SidebarItem[];
	defaultOpen?: boolean;
};
