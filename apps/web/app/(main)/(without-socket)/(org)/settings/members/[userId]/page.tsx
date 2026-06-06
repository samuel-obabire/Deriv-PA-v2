import { verifySession } from "@/lib/session";

type MemberProfilePageProps = {
	params: Promise<{ userId: string }>;
};

const MemberProfilePage = async ({ params }: MemberProfilePageProps) => {
	await verifySession();
	const { userId } = await params;

	return (
		<div className="container max-w-2xl space-y-6 mt-8">
			<section className="space-y-4">
				<h2 className="title text-2xl">Member Profile</h2>
				<p className="text-muted-foreground">{userId}</p>
			</section>
		</div>
	);
};

export default MemberProfilePage;
