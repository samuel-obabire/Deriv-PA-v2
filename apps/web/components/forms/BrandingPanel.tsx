import { Check } from "lucide-react";
import Image from "next/image";

const features = [
	{
		label: "Real-time fund transfers",
		desc: "Move funds instantly across client accounts",
	},
	{
		label: "Rate management",
		desc: "Configure and control your agent exchange rates",
	},
	{
		label: "Transaction cancellation",
		desc: "Cancel pending transfers before they are processed",
	},
	{
		label: "Audit & reporting",
		desc: "Full transaction history and statement exports",
	},
	{
		label: "Multi-org support",
		desc: "Manage multiple organizations from one account",
	},
];

const BrandingPanel = () => (
	<div className="dark hidden lg:flex lg:w-[46%] xl:w-1/2 relative flex-col items-center justify-center p-14 bg-background overflow-hidden">
		{/* Ambient red glows */}
		<div className="absolute top-1/3 -left-24 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
		<div className="absolute bottom-1/4 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

		<div className="relative z-10 flex flex-col items-center text-center max-w-xs w-full">
			<Image
				src="/asset/logo.svg"
				alt="DerivPA"
				width={72}
				height={72}
				priority
			/>

			<h1 className="mt-5 text-[2.5rem] font-bold text-foreground tracking-tight leading-none">
				DerivPA
			</h1>
			<p className="mt-3 text-14-regular text-muted-foreground leading-relaxed">
				The payment agent management platform built for Deriv partners.
			</p>

			<div className="mt-10 w-full space-y-4 text-left">
				{features.map(({ label, desc }) => (
					<div key={label} className="flex items-start gap-3">
						<div className="mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/30">
							<Check className="size-3 text-primary" strokeWidth={2.5} />
						</div>
						<div>
							<p className="text-14-medium text-foreground">{label}</p>
							<p className="text-12-regular text-muted-foreground mt-0.5">
								{desc}
							</p>
						</div>
					</div>
				))}
			</div>
		</div>

		<p className="absolute bottom-8 text-12-regular text-muted-foreground tracking-widest uppercase">
			Powered by Deriv API
		</p>
	</div>
);

export default BrandingPanel;
