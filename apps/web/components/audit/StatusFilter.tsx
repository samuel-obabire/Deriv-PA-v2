import { PayoutStatusEnum } from "@repo/db";
import { PAYOUT_STATUS } from "@repo/db/enums";
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
	onSelect: (status: PAYOUT_STATUS) => void;
}) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button type="button" className="h-10 bg-primary/20 p-2 rounded-md">
					<ListFilter className="text-accent-foreground h-full" />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent>
				<DropdownMenuGroup>
					<DropdownMenuLabel>Status</DropdownMenuLabel>

					{PayoutStatusEnum.enumValues.map((status) => (
						<DropdownMenuItem
							key={status}
							onClick={() => onSelect(status as PAYOUT_STATUS)}
						>
							<span className="capitalize">{status.toLowerCase()}</span>
						</DropdownMenuItem>
					))}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default StatusFilter;
