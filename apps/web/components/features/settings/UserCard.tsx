"use client";

import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@repo/ui";
import { User } from "@/lib/auth";

type UserCardProps = {
	user: User;
};

const UserCard = ({ user }: UserCardProps) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{user.name}</CardTitle>
				<CardDescription>{user.email}</CardDescription>
			</CardHeader>
			<CardContent>
				<Button className="w-full" variant="outline">
					Enable Passkey
				</Button>
			</CardContent>
		</Card>
	);
};

export default UserCard;
