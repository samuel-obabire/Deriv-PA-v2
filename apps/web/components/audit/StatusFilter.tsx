import { PayoutStatusEnum } from "@repo/db";
import { ListFilter } from "lucide-react";

import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const StatusFilter = ({
	onSelect,
}: {
	onSelect: (status: (typeof PayoutStatusEnum.enumValues)[number]) => void;
}) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					type="button"
					className="self-end bg-primary/20 mt-3 p-2 rounded-md"
				>
					<ListFilter className="text-accent-foreground" />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent>
				<DropdownMenuGroup>
					<DropdownMenuLabel>Status</DropdownMenuLabel>

					{PayoutStatusEnum.enumValues.map((status) => (
						<DropdownMenuItem key={status} onClick={() => onSelect(status)}>
							<span className="capitalize">{status.toLowerCase()}</span>
						</DropdownMenuItem>
					))}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default StatusFilter;
