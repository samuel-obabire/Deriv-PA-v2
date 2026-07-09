"use client";

import {
	Button,
	ConfirmDialog,
	Label,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@repo/ui";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

const PRESET_HOURS = [1, 2, 4, 8, 24] as const;
const DEFAULT_HOURS = 8;

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => i);
const MINUTE_OPTIONS = [0, 5, 10, 15, 30, 45];

type Props = {
	isPending: boolean;
	onApprove: (hours: number) => void;
};

const ApproveAccessDialog = ({ isPending, onApprove }: Props) => {
	const [preset, setPreset] = useState<number | "custom">(DEFAULT_HOURS);
	const [customHours, setCustomHours] = useState(1);
	const [customMinutes, setCustomMinutes] = useState(0);

	const resolveHours = () => {
		if (preset !== "custom") return preset;
		const total = customHours + customMinutes / 60;
		return total > 0 ? total : 0.25;
	};

	return (
		<ConfirmDialog
			trigger={
				<Button size="xs" className="gap-1.5" disabled={isPending}>
					<CheckCircle2 className="size-4" />
					Approve
				</Button>
			}
			title="Approve elevated access?"
			description="Choose how long the user should have elevated access for."
			confirmLabel="Approve"
			icon={<CheckCircle2 className="size-5 text-primary" />}
			isPending={isPending}
			onConfirm={() => onApprove(resolveHours())}
		>
			<div className="space-y-4">
				<div className="flex flex-wrap gap-1.5 rounded-lg bg-muted/60 p-1.5">
					{PRESET_HOURS.map((hours) => (
						<Button
							key={hours}
							type="button"
							size="sm"
							variant={preset === hours ? "default" : "ghost"}
							className="flex-1 rounded-md"
							onClick={() => setPreset(hours)}
						>
							{hours}h
						</Button>
					))}
					<Button
						type="button"
						size="sm"
						variant={preset === "custom" ? "default" : "ghost"}
						className="flex-1 rounded-md"
						onClick={() => setPreset("custom")}
					>
						Custom
					</Button>
				</div>

				{preset === "custom" && (
					<div className="flex items-end gap-3 rounded-lg border bg-muted/30 p-3">
						<div className="flex-1 space-y-1.5">
							<Label htmlFor="custom-hours">Hours</Label>
							<Select
								value={String(customHours)}
								onValueChange={(value) => setCustomHours(Number(value))}
							>
								<SelectTrigger id="custom-hours" className="w-full bg-card">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{HOUR_OPTIONS.map((h) => (
										<SelectItem key={h} value={String(h)}>
											{h}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="flex-1 space-y-1.5">
							<Label htmlFor="custom-minutes">Minutes</Label>
							<Select
								value={String(customMinutes)}
								onValueChange={(value) => setCustomMinutes(Number(value))}
							>
								<SelectTrigger id="custom-minutes" className="w-full bg-card">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{MINUTE_OPTIONS.map((m) => (
										<SelectItem key={m} value={String(m)}>
											{m}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				)}
			</div>
		</ConfirmDialog>
	);
};

export default ApproveAccessDialog;
