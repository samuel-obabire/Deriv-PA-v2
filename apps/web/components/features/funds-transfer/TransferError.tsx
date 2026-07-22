import {
	Button,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogPortal,
	DialogTitle,
} from "@repo/ui";
import type { ReactNode } from "react";

interface TransferErrorProps {
	open: boolean;
	title: string;
	message: string;
	onOpenChange: (open: boolean) => void;
	children?: ReactNode;
}

const TransferError = ({
	open,
	title,
	message,
	onOpenChange,
	children,
}: TransferErrorProps) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogPortal>
				<DialogContent className="sm:max-w-sm">
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>{message}</DialogDescription>
					</DialogHeader>
					{children}
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline">Dismiss</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</DialogPortal>
		</Dialog>
	);
};

export default TransferError;
