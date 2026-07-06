"use client";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	cn,
	Sheet,
	SheetClose,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from "@repo/ui";
import { ChevronDown, LucideIcon, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode, use } from "react";
import Logout from "@/components/features/auth/Logout";
import ThemeToggler from "@/components/features/theme/ThemeToggler";
import { Session, User } from "@/lib/auth";
import { RoleNames } from "@/lib/permissions";
import { SidebarGroup, SidebarItem } from "./types";
import UserCard from "./UserCard";
import { getSidebarForRole } from "./utils";

const BrandMark = () => (
	<div className="flex h-16 shrink-0 items-center border-b border-sidebar-border px-5">
		<div className="flex items-center gap-2.5">
			<Image
				src="/asset/logo.svg"
				alt="DerivPA"
				width={26}
				height={26}
				priority
			/>
			<span className="font-space font-semibold text-[15px] tracking-tight">
				DerivPA
			</span>
		</div>
	</div>
);

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
			className={cn(
				"relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors duration-150",
				isActive
					? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
					: "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
			)}
		>
			{isActive && (
				<span
					className="absolute left-0 inset-y-1.5 w-0.5 rounded-full bg-primary"
					aria-hidden="true"
				/>
			)}
			{Icon && (
				<Icon
					className={cn(
						"size-4 shrink-0 transition-colors",
						isActive ? "text-primary" : "",
					)}
				/>
			)}
			<span className="truncate">{title}</span>
		</Link>
	);
};

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
		<div className="flex h-full flex-col">
			<BrandMark />

			<nav className="flex-1 overflow-y-auto px-3 py-4">
				<div className="space-y-5">
					{groups.map((group) => (
						<Collapsible
							key={group.title}
							defaultOpen={group.defaultOpen ?? true}
						>
							<CollapsibleTrigger className="no-ring group mb-1 flex w-full items-center justify-between px-3 py-0.5">
								<span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
									{group.title}
								</span>
								<ChevronDown className="size-3.5 text-muted-foreground/40 transition-transform duration-200 group-data-[state=open]:rotate-180" />
							</CollapsibleTrigger>

							<CollapsibleContent className="space-y-0.5 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 duration-150">
								{renderItems(group.items)}
							</CollapsibleContent>
						</Collapsible>
					))}
				</div>
			</nav>

			<div className="shrink-0 border-t border-sidebar-border p-3 space-y-2">
				<UserCard user={user} />
				<div className="flex items-center justify-between px-1">
					<ThemeToggler />
					<Logout />
				</div>
			</div>
		</div>
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
		<aside className="hidden lg:flex flex-col h-dvh border-r border-sidebar-border bg-sidebar overflow-hidden">
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
				<button
					type="button"
					aria-label="Open menu"
					className="flex items-center justify-center rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
				>
					<Menu className="size-5" />
				</button>
			</SheetTrigger>
			<SheetContent
				side="left"
				className="w-72 p-0 animate-in slide-in-from-left"
				aria-describedby={undefined}
			>
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
