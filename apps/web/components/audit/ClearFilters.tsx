import { Button } from "../ui/button";

const ClearFilters = ({ onClear }: { onClear: () => void }) => {
	return (
		<div className="flex justify-end">
			<Button
				type="button"
				variant="ghost"
				onClick={onClear}
				className="text-xs text-muted-foreground hover:text-foreground"
			>
				Clear filters
			</Button>
		</div>
	);
};

export default ClearFilters;
