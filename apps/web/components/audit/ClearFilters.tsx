import { Button } from "../ui/button";

const ClearFilters = ({
	onClear,
	hasFilter,
}: {
	onClear: () => void;
	hasFilter?: boolean;
}) => {
	return hasFilter ? (
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
	) : null;
};

export default ClearFilters;
