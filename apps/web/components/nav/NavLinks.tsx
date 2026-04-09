"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ROUTES from "@/lib/constants/routes";
import { cn } from "@/lib/utils";

const links = [{ label: "Settings", href: ROUTES.SETTINGS }];

const NavLinks = () => {
	const pathname = usePathname();

	return (
		<>
			{links.map((link) => {
				const isActive = pathname === link.href;

				return (
					<Link
						key={link.label}
						href={link.href}
						className={cn(
							"font-space font-bold tracking-tight px-3 rounded transition-colors text-accent-foreground hover:text-primary active:text-primary",
							{
								"text-primary": isActive,
							},
						)}
					>
						{link.label}
					</Link>
				);
			})}
		</>
	);
};

export default NavLinks;
