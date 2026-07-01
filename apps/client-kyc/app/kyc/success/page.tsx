import { CheckCircle, MessageCircle } from "lucide-react";

const KycSuccessPage = () => {
	return (
		<div className="min-h-screen flex items-center justify-center p-6">
			<div className="w-full max-w-sm text-center space-y-6">
				<div className="flex justify-center">
					<div className="flex size-16 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
						<CheckCircle className="size-8 text-primary" />
					</div>
				</div>

				<div className="space-y-2">
					<h1 className="text-2xl font-semibold tracking-tight">All done.</h1>
					<p className="text-sm text-muted-foreground">
						Go back to WhatsApp and continue chatting with your agent.
					</p>
				</div>

				<div className="flex items-center justify-center gap-2 text-sm font-medium text-primary">
					<MessageCircle className="size-4" />
					<span>Return to WhatsApp</span>
				</div>
			</div>
		</div>
	);
};

export default KycSuccessPage;
