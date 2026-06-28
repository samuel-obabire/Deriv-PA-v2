"use client";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	Sheet,
	SheetClose,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from "@repo/ui";
import { ChevronDown, LucideIcon, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode, use } from "react";
import ThemeToggler from "@/components/theme/ThemeToggler";
import { Session, User } from "@/lib/auth";
import { RoleNames } from "@/lib/permissions";
import Logout from "../../auth/Logout";
import { SidebarGroup, SidebarItem } from "./types";
import UserCard from "./UserCard";
import { getSidebarForRole } from "./utils";

const SidebarContent = ({
	renderItems,
	groups,
	user,
}: {
	groups: SidebarGroup[];
	renderItems: (items: SidebarItem[]) => ReactNode;
	user: User;
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

			<div className="space-y-3">
				<UserCard user={user} />
				<div className="flex justify-between">
					<ThemeToggler />
					<Logout />
				</div>
			</div>
		</div>
	);
};

const SideBarLink = ({
	Icon,
	href,
	isActive,
	title,
	...props
}: {
	href: string;
	isActive: boolean;
	Icon?: LucideIcon;
	title: string;
} & Omit<React.ComponentPropsWithoutRef<typeof Link>, "href">) => {
	return (
		<Link
			href={href}
			{...props}
			className={`flex items-center gap-2 px-3 py-2 rounded-md transition
											${isActive ? "bg-muted font-medium" : "hover:bg-muted/50"}
											`}
		>
			{Icon && <Icon className="w-4 h-4" />}
			{title}
		</Link>
	);
};

export const DesktopSideBar = ({
	sessionPromise,
}: {
	sessionPromise: Promise<Session | null>;
}) => {
	const pathname = usePathname();

	const session = use(sessionPromise);
	if (!session) return null;

	const groups = getSidebarForRole(session.user.role);

	return (
		<aside className="hidden pt-10 lg:block h-dvh border-r shadow-sidebar-primary overflow-y-auto">
			<SidebarContent
				groups={groups}
				user={session.user}
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

const SideBar = ({ role, user }: { role: RoleNames; user: User }) => {
	const pathname = usePathname();
	const groups = getSidebarForRole(role);

	return (
		<Sheet>
			<SheetTrigger asChild>
				<button type="button" aria-label="Open menu">
					<Menu />
				</button>
			</SheetTrigger>
			<SheetContent side="left" aria-describedby={undefined}>
				<SheetTitle className="sr-only">Navigation</SheetTitle>
				<SidebarContent
					groups={groups}
					user={user}
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
