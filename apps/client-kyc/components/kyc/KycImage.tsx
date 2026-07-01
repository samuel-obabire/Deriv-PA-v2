import { cn } from "@repo/ui";
import Image from "next/image";

type Props = {
	src: string;
	alt: string;
	className?: string;
	children?: React.ReactNode;
};

const KycImage = ({ src, alt, className, children }: Props) => (
	<div className={cn("relative overflow-hidden", className)}>
		<Image src={src} alt={alt} fill className="object-cover" />
		{children}
	</div>
);

export default KycImage;
