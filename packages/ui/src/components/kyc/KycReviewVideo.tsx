import { cn } from "../../lib/utils";

type Props = {
	videoUrl: string;
	className?: string;
};

export const KycReviewVideo = ({ videoUrl, className }: Props) => (
	<video
		src={videoUrl}
		controls
		controlsList="nodownload nofullscreen noremoteplayback"
		className={cn("w-full rounded-md", className)}
	>
		<track kind="captions" />
	</video>
);

