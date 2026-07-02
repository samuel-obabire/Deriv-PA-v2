"use client";

import { Dialog } from "radix-ui";
import * as React from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import { DialogOverlay, DialogPortal, DialogTitle } from "./dialog";

type ConfirmDialogProps = {
	trigger: React.ReactNode;
	title: string;
	description?: string;
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

	const handleConfirm = () => {
		onConfirm();
		setOpen(false);
	};

	const hasBody = Boolean(description || children);

	return (
		<Dialog.Root open={open} onOpenChange={(next) => { if (!next) handleCancel(); else setOpen(true); }}>
			<Dialog.Trigger asChild>{trigger}</Dialog.Trigger>

			<DialogPortal>
				<DialogOverlay />
				<Dialog.Content
					aria-describedby={undefined}
					className={cn(
						"fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden bg-popover text-sm text-popover-foreground shadow-xl outline-none",
						"rounded-t-2xl",
						"animate-in slide-in-from-bottom-4 duration-300 data-closed:animate-out data-closed:slide-out-to-bottom-4 data-closed:duration-200",
						"sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:ring-1 sm:ring-border/50",
						"sm:slide-in-from-bottom-0 sm:data-open:zoom-in-95 sm:data-closed:zoom-out-95",
					)}
				>

					<div className="flex shrink-0 justify-center pt-3 sm:hidden">
						<div className="h-1 w-8 rounded-full bg-muted-foreground/25" />
					</div>


					<div className="relative shrink-0 border-b px-5 py-4">
						<Button
							variant="ghost"
							size="icon-sm"
							className="absolute top-3 right-3"
							onClick={handleCancel}
						>
							<X className="size-4" />
						</Button>
						<div className="flex flex-col items-center gap-2 pr-6 text-center">
							{icon && <span className="shrink-0">{icon}</span>}
							<DialogTitle className="text-sm font-semibold">{title}</DialogTitle>
						</div>
					</div>


					{hasBody && (
						<div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
							{description && (
								<p
									className={cn(
										"text-sm text-muted-foreground",
										children && "mb-4",
									)}
								>
									{description}
								</p>
							)}
							{children}
						</div>
					)}

					{/* Footer */}
					<div className="shrink-0 border-t px-5 py-4">
						<div className="flex gap-2.5">
							<Button
								variant="outline"
								className="flex-1"
								disabled={isPending}
								onClick={handleCancel}
							>
								{cancelLabel}
							</Button>
							<Button
								variant={confirmVariant}
								className="flex-1"
								disabled={isPending}
								onClick={handleConfirm}
							>
								{isPending ? "Please wait…" : confirmLabel}
							</Button>
						</div>
					</div>
				</Dialog.Content>
			</DialogPortal>
		</Dialog.Root>
	);
};
