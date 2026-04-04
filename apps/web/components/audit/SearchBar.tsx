import { Input } from "../ui/input";
import ClearSearchButton from "./ClearSearchButton";

const SearchBar = ({
	query,
	setQuery,
	onSearchSubmit,
	onSearchClear,
	hasSearch,
}: {
	query?: string;
	setQuery: (value: string) => void;
	onSearchSubmit: () => void;
	onSearchClear: () => void;
	hasSearch: boolean;
}) => {
	return (
		<div className="flex w-full h-10 gap-2 relative">
			<Input
				className="input-class font-bold flex-1 h-full"
				name="searchQuery"
				value={query ?? ""}
				onChange={(e) => setQuery(e.target.value)}
				placeholder="Search CR, name"
			/>

			{hasSearch && <ClearSearchButton onClick={onSearchClear} />}
		</div>
	);
};

export default SearchBar;
