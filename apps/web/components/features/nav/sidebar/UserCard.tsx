import { Badge } from "@repo/ui";
import Image from "next/image";
import { User } from "@/lib/auth";

const UserCard = ({ user }: { user: User }) => {
	const initials = user.name
		? user.name
				.split(" ")
				.map((n) => n[0] ?? "")
				.join("")
				.toUpperCase()
				.slice(0, 2)
		: (user.email[0] ?? "").toUpperCase();

	return (
		<div className="rounded-xl bg-muted/50 p-3 flex items-center gap-3 ring-1 ring-foreground/5">
			<div className="w-9 h-9 shrink-0 rounded-full overflow-hidden bg-muted flex items-center justify-center">
				{user.image ? (
					<Image
						src={user.image}
						alt={user.name ?? "User"}
						className="w-full h-full object-cover"
					/>
				) : (
					<span className="text-12-semibold text-muted-foreground">
						{initials}
					</span>
				)}
			</div>

			<div className="flex-1 min-w-0">
				<p className="text-14-medium truncate">{user.name}</p>
				<p className="text-12-regular text-muted-foreground truncate">
					{user.email}
				</p>
			</div>

			{user.role && (
				<Badge variant="outline" className="shrink-0 capitalize text-[10px]">
					{user.role}
				</Badge>
			)}
		</div>
	);
};

export default UserCard;
