import { LucideIcon } from "lucide-react";

export type SidebarItem = {
	title: string;
	href: string;
	icon?: LucideIcon;
	roles?: ("admin" | "staff")[];
};

export type SidebarGroup = {
	title: string;
	items: SidebarItem[];
	defaultOpen?: boolean;
};
