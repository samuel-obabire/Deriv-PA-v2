"use client";

import { Badge } from "../ui/badge";
import {
	Card,
	CardAction,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";

type StatCardProps = {
	title: string;
	value: string | number;
	icon: React.ReactNode;
	badgeText: string;
	badgeClass?: string;
	valueClass?: string;
};

const StatCard = ({
	title,
	value,
	icon,
	badgeText,
	badgeClass,
	valueClass,
}: StatCardProps) => {
	return (
		<Card className="w-full gap-1 sm:gap-2 bg-muted mx-auto">
			<CardHeader>
				<CardTitle className="uppercase text-accent-foreground text-md font-bold">
					{title}
				</CardTitle>

				<CardAction>{icon}</CardAction>
			</CardHeader>

			<CardContent
				className={`font-space text-3xl font-extrabold ${valueClass ?? ""}`}
			>
				{value}
			</CardContent>

			<CardFooter>
				<Badge variant="default" className={`rounded-sm ${badgeClass ?? ""}`}>
					{badgeText}
				</Badge>
			</CardFooter>
		</Card>
	);
};

export default StatCard;
