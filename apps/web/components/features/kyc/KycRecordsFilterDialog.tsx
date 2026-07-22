"use client";

import { Button, ConfirmDialog, Input, Label, Separator } from "@repo/ui";
import { SlidersHorizontal } from "lucide-react";

const KycRecordsFilterDialog = ({
	email,
	onEmailChange,
	externalReferenceId,
	onExternalReferenceIdChange,
	derivNickname,
	onDerivNicknameChange,
	name,
	onNameChange,
	onApply,
	onReset,
	activeFilterCount,
}: {
	email: string;
	onEmailChange: (val: string) => void;
	externalReferenceId: string;
	onExternalReferenceIdChange: (val: string) => void;
	derivNickname: string;
	onDerivNicknameChange: (val: string) => void;
	name: string;
	onNameChange: (val: string) => void;
	onApply: () => void;
	onReset: () => void;
	activeFilterCount: number;
}) => {
	const trigger = (
		<Button variant="outline" size="sm" className="gap-2">
			<SlidersHorizontal className="size-4" />
			<span>Filters</span>
			{activeFilterCount > 0 && (
				<span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
					{activeFilterCount}
				</span>
			)}
		</Button>
	);

	return (
		<ConfirmDialog
			trigger={trigger}
			title="Filter KYC Records"
			confirmLabel="Apply Filters"
			cancelLabel="Reset"
			onConfirm={onApply}
			onCancel={onReset}
		>
			<div className="space-y-5">
				<div className="space-y-2">
					<Label
						htmlFor="kyc-record-name"
						className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
					>
						Name
					</Label>
					<Input
						id="kyc-record-name"
						placeholder="e.g. John Doe"
						value={name}
						onChange={(e) => onNameChange(e.target.value)}
						autoComplete="off"
					/>
				</div>

				<Separator />

				<div className="space-y-2">
					<Label
						htmlFor="kyc-record-email"
						className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
					>
						Email
					</Label>
					<Input
						id="kyc-record-email"
						placeholder="e.g. client@example.com"
						value={email}
						onChange={(e) => onEmailChange(e.target.value)}
						autoComplete="off"
					/>
				</div>

				<Separator />

				<div className="space-y-2">
					<Label
						htmlFor="kyc-record-client-id"
						className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
					>
						Client ID
					</Label>
					<Input
						id="kyc-record-client-id"
						placeholder="e.g. 09t86-5995-3di34-3944f"
						value={externalReferenceId}
						onChange={(e) => onExternalReferenceIdChange(e.target.value)}
						autoComplete="off"
					/>
				</div>

				<Separator />

				<div className="space-y-2">
					<Label
						htmlFor="kyc-record-nickname"
						className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
					>
						Deriv Nickname
					</Label>
					<Input
						id="kyc-record-nickname"
						placeholder="e.g. client_eee"
						value={derivNickname}
						onChange={(e) => onDerivNicknameChange(e.target.value)}
						autoComplete="off"
					/>
				</div>
			</div>
		</ConfirmDialog>
	);
};

export default KycRecordsFilterDialog;
