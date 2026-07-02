import { cn } from "@repo/ui";

type Props = {
	src: string;
	className?: string;
};

const KycVideo = ({ src, className }: Props) => (
	<video
		src={src}
		controls
		controlsList="nodownload nofullscreen noremoteplayback"
		className={cn("w-full", className)}
	>
		<track kind="captions" />
	</video>
);

export default KycVideo;
