"use client";

import * as React from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "./alert-dialog";
import { Button } from "./button";

type ConfirmDialogProps = {
	trigger: React.ReactNode;
	title: string;
	description: string;
	confirmLabel?: string;
	cancelLabel?: string;
	confirmVariant?: React.ComponentProps<typeof Button>["variant"];
	isPending?: boolean;
	icon?: React.ReactNode;
	onConfirm: () => void;
	onCancel?: () => void;
	children?: React.ReactNode;
};

export const ConfirmDialog = ({
	trigger,
	title,
	description,
	confirmLabel = "Confirm",
	cancelLabel = "Cancel",
	confirmVariant = "default",
	isPending = false,
	icon,
	onConfirm,
	onCancel,
	children,
}: ConfirmDialogProps) => {
	const [open, setOpen] = React.useState(false);

	const handleCancel = () => {
		onCancel?.();
		setOpen(false);
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

			<AlertDialogContent size="sm">
				<AlertDialogHeader>
					{icon && <AlertDialogMedia>{icon}</AlertDialogMedia>}
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>

				{children && <div className="px-0.5">{children}</div>}

				<AlertDialogFooter>
					<AlertDialogCancel disabled={isPending} onClick={handleCancel}>
						{cancelLabel}
					</AlertDialogCancel>
					<AlertDialogAction
						variant={confirmVariant}
						disabled={isPending}
						onClick={onConfirm}
					>
						{isPending ? "Please wait…" : confirmLabel}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
