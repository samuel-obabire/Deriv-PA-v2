import { ListFilter } from "lucide-react";
import Form from "next/form";
import ROUTES from "@/lib/constants/routes";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const AuditFilters = () => {
	return (
		<div className="flex flex-col">
			<Form action={ROUTES.AUDIT}>
				<div className="flex h-10 gap-2">
					<Input
						className="input-class font-bold flex-1 h-full"
						name="query"
						placeholder="Search CR, name, or amount"
					/>
					<Button className="h-full" type="submit">
						Search
					</Button>
				</div>
			</Form>

			<button
				type="button"
				className="self-end bg-primary/20 mt-5 p-2 rounded-md"
			>
				<ListFilter className="text-accent-foreground" />
			</button>
		</div>
	);
};

export default AuditFilters;
