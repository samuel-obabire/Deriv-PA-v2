"use client";

import { ChevronDown, LucideIcon, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import ThemeToggler from "@/components/theme/ThemeToggler";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTrigger,
} from "@/components/ui/sheet";
import Logout from "../../auth/Logout";
import { sidebarConfig } from "./config";
import { SidebarGroup, SidebarItem } from "./types";

const getSidebarForRole = (role: "admin" | "staff") => {
	return sidebarConfig
		.map((group) => ({
			...group,
			items: group.items.filter(
				(item) => !item.roles || item.roles.includes(role),
			),
		}))
		.filter((group) => group.items.length > 0);
};

const SidebarContent = ({
	renderItems,
	groups,
}: {
	groups: SidebarGroup[];
	renderItems: (items: SidebarItem[]) => ReactNode;
}) => {
	return (
		<div className="h-full flex flex-col justify-between p-4 pt-6 text-16-regular">
			<div className="space-y-8">
				{groups.map((group) => (
					<Collapsible key={group.title} defaultOpen={group.defaultOpen}>
						<CollapsibleTrigger className="flex w-full items-center justify-between no-ring font-semibold text-muted-foreground mb-2">
							{group.title}
							<ChevronDown className="w-4 h-4 transition-transform data-[state=open]:rotate-180" />
						</CollapsibleTrigger>

						<CollapsibleContent className="space-y-1">
							{renderItems(group.items)}
						</CollapsibleContent>
					</Collapsible>
				))}
			</div>

			<div className="flex justify-between">
				<ThemeToggler />
				<Logout />
			</div>
		</div>
	);
};

const SideBarLink = ({
	Icon,
	href,
	isActive,
	title,
}: {
	href: string;
	isActive: boolean;
	Icon?: LucideIcon;
	title: string;
}) => {
	return (
		<Link
			key={href}
			href={href}
			className={`flex items-center gap-2 px-3 py-2 rounded-md transition
											${isActive ? "bg-muted font-medium" : "hover:bg-muted/50"}
											`}
		>
			{Icon && <Icon className="w-4 h-4" />}
			{title}
		</Link>
	);
};

export const DesktopSideBar = () => {
	const pathname = usePathname();
	const groups = getSidebarForRole("admin");

	return (
		<aside className="hidden pt-10 lg:block h-dvh border-r shadow-sidebar-primary overflow-y-auto">
			<SidebarContent
				groups={groups}
				renderItems={(items) => {
					return items.map((item) => {
						const isActive = pathname === item.href;

						return (
							<SideBarLink
								Icon={item.icon}
								href={item.href}
								isActive={isActive}
								title={item.title}
								key={item.href}
							/>
						);
					});
				}}
			/>
		</aside>
	);
};

const SideBar = () => {
	const pathname = usePathname();
	const groups = getSidebarForRole("admin");

	return (
		<Sheet>
			<SheetTrigger asChild>
				<button type="button" aria-label="Open menu">
					<Menu />
				</button>
			</SheetTrigger>
			<SheetContent side="left">
				<SidebarContent
					groups={groups}
					renderItems={(items) => {
						return items.map((item) => {
							const isActive = pathname === item.href;

							return (
								<SheetClose key={item.href} asChild>
									<SideBarLink
										Icon={item.icon}
										href={item.href}
										isActive={isActive}
										title={item.title}
									/>
								</SheetClose>
							);
						});
					}}
				/>
			</SheetContent>
		</Sheet>
	);
};

export default SideBar;
