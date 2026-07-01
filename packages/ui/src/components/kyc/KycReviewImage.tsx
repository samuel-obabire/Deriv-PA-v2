import Image from "next/image";
import { cn } from "../../lib/utils";

type Props = {
	imageUrl: string;
	label: string;
	className?: string;
};

export const KycReviewImage = ({ imageUrl, label, className }: Props) => (
	<div className={cn("relative h-100 overflow-hidden rounded-md", className)}>
		<Image src={imageUrl} alt={label} fill unoptimized className="object-cover" />
	</div>
);

