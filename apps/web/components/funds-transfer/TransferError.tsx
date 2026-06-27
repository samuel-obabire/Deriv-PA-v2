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

interface TransferErrorProps {
	open: boolean;
	title: string;
	message: string;
	onOpenChange: (open: boolean) => void;
}

const TransferError = ({
	open,
	title,
	message,
	onOpenChange,
}: TransferErrorProps) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogPortal>
				<DialogContent className="sm:max-w-sm">
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>{message}</DialogDescription>
					</DialogHeader>
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
