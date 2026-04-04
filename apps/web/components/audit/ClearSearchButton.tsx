import { X } from "lucide-react";
import { Button } from "../ui/button";

const ClearSearchButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<Button
			type="button"
			variant="ghost"
			onClick={onClick}
			className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
			aria-label="Clear search"
		>
			<X className="size-4" strokeWidth={4} />
		</Button>
	);
};

export default ClearSearchButton;
