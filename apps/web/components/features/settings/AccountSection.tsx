"use client";
import { use } from "react";
import { Session } from "@/lib/auth";
import UserCard from "./UserCard";

type AccountSectionProp = {
	sessionPromise: Promise<Session>;
};

const AccountSection = ({ sessionPromise }: AccountSectionProp) => {
	const session = use(sessionPromise);

	return <UserCard user={session.user} />;
};

export default AccountSection;
