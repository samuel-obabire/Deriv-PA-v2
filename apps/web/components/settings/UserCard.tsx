"use client";

import { User } from "@/lib/auth";
import { Button } from "../ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";

type UserCardProps = {
	user: User;
};

const UserCard = ({ user }: UserCardProps) => {
	return (
		<Card className="bg-muted">
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
