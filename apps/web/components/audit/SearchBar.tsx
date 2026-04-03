import { Button } from "../ui/button";
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
		<div className="flex h-10 gap-2 relative">
			<Input
				className="input-class font-bold flex-1 h-full pr-10"
				name="searchQuery"
				value={query ?? ""}
				onChange={(e) => setQuery(e.target.value)}
				placeholder="Search CR, name"
			/>

			{hasSearch && <ClearSearchButton onClick={onSearchClear} />}

			<Button onClick={onSearchSubmit} className="h-full" type="submit">
				Search
			</Button>
		</div>
	);
};

export default SearchBar;
