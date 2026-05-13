"use client";

import { CURRENCY } from "@repo/db/enums";
import { tryCatch } from "@repo/utils";
import { KeyRound, Pencil, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createOrganizationCurrency } from "@/lib/actions/currency/createOrganizationCurrency";
import { deleteOrganizationCurrency } from "@/lib/actions/currency/deleteOrganizationCurrency";
import { updateOrganizationCurrency } from "@/lib/actions/currency/updateOrganizationCurrency";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";

type TokenState = "empty" | "set" | "editing";

type CurrencyToken = {
	code: CURRENCY;
	label: string;
	configured: boolean;
	data: {
		id: string;
		code: CURRENCY;
		label: string;
	} | null;
};

type TokenCardProps = {
	token: CurrencyToken;
};

const TokenCard = ({ token }: TokenCardProps) => {
	const [state, setState] = useState<TokenState>(() =>
		token.configured ? "set" : "empty",
	);

	const [inputValue, setInputValue] = useState("");
	const [isPending, startTransition] = useTransition();

	const handleSave = async () => {
		if (!inputValue.trim()) return;

		startTransition(async () => {
			const savePromise = !token.configured
				? createOrganizationCurrency({
						code: token.code,
						label: token.label,
						token: inputValue.trim(),
					})
				: updateOrganizationCurrency({
						code: token.code,
						token: inputValue.trim(),
					});

			const [saveResult, saveError] = await tryCatch(() => savePromise);

			if (saveError) {
				toast.error(saveError.message);

				return;
			}

			if (!saveResult?.success) {
				toast.error(saveResult?.error?.message ?? "Unable to process request");

				return;
			}

			toast.success("Token saved successfully");

			setInputValue("");
			setState("set");
		});
	};

	const handleDelete = async () => {
		startTransition(async () => {
			const [deleteResult, deleteError] = await tryCatch(() =>
				deleteOrganizationCurrency({ code: token.code }),
			);

			if (deleteError) {
				toast.error(deleteError.message);

				return;
			}

			if (!deleteResult?.success) {
				toast.error(
					deleteResult?.error?.message ?? "Unable to process request",
				);

				return;
			}

			toast.success("Token deleted successfully");

			setInputValue("");
			setState("empty");
		});
	};

	const handleCancel = () => {
		setInputValue("");
		setState(token.configured ? "set" : "empty");
	};

	return (
		<Card className="flex flex-col">
			<CardHeader className="border-b">
				<div className="flex items-center gap-3">
					<div
						className={cn(
							"flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors",
							state === "set"
								? "bg-success/15 text-success"
								: "bg-muted text-muted-foreground",
						)}
					>
						<KeyRound className="size-4" />
					</div>

					<div className="min-w-0">
						<CardTitle className="text-sm">{token.label}</CardTitle>

						<p className="text-xs text-muted-foreground">{token.code}</p>
					</div>
				</div>
			</CardHeader>

			{state === "editing" ? (
				<CardContent className="flex flex-col gap-2 pt-4">
					<Input
						className="no-ring"
						type="password"
						placeholder={`Enter ${token.code} token`}
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						autoFocus
						disabled={isPending}
					/>

					<p className="text-xs text-muted-foreground">
						Enter a new token to replace the existing one.
					</p>

					<div className="flex gap-2">
						<Button
							size="sm"
							className="flex-1"
							disabled={!inputValue.trim() || isPending}
							onClick={handleSave}
						>
							{isPending ? "Saving..." : "Save"}
						</Button>

						<Button
							size="sm"
							variant="outline"
							className="flex-1"
							disabled={isPending}
							onClick={handleCancel}
						>
							Cancel
						</Button>
					</div>
				</CardContent>
			) : (
				<CardFooter className="flex items-center justify-between gap-2">
					{state === "set" ? (
						<div className="flex gap-1">
							<Button
								size="icon-sm"
								variant="ghost"
								disabled={isPending}
								onClick={() => setState("editing")}
							>
								<Pencil className="size-4" />
							</Button>

							<Button
								size="icon-sm"
								variant="ghost"
								disabled={isPending}
								className="text-destructive hover:bg-destructive/10 hover:text-destructive"
								onClick={handleDelete}
							>
								<Trash2 className="size-4" />
							</Button>
						</div>
					) : (
						<>
							<span className="text-xs text-muted-foreground">
								Not configured
							</span>

							<Button
								size="sm"
								variant="outline"
								disabled={isPending}
								onClick={() => setState("editing")}
							>
								Set Token
							</Button>
						</>
					)}
				</CardFooter>
			)}
		</Card>
	);
};

export default TokenCard;
