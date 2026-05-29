"use client";

import { tryCatch } from "@repo/utils";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OrganizationWithMembers } from "@/lib/auth-client";
import { ActionResponse } from "@/lib/types/global";
import { CreateOrgSchema } from "@/lib/validations/organization";

type CreateOrgData = z.infer<typeof CreateOrgSchema>;

type CreateOrganizationFormProps = {
	handleOrgCreate: ({
		orgName,
	}: CreateOrgData) => Promise<ActionResponse<OrganizationWithMembers>>;
	onOrgCreate?: (newOrgId: string) => Promise<void>;
};

const CreateOrganizationForm = ({
	onOrgCreate,
	handleOrgCreate,
}: CreateOrganizationFormProps) => {
	const [showCreate, setShowCreate] = useState(false);
	const [newOrgName, setNewOrgName] = useState("");

	const handleCreate = async () => {
		if (!newOrgName.trim()) return;

		const [result, error] = await tryCatch(() =>
			handleOrgCreate({ orgName: newOrgName }),
		);

		if (error)
			return toast.error(error.message ?? "Unable to create Organization");

		if (!result.success)
			return toast.error(
				result.error?.message ?? "Unable to create Organization",
			);

		if (!result.data?.id) return toast.error("Unable to create Organization");

		await onOrgCreate?.(result.data.id);
		toast.success("Organization created successfully!");

		setShowCreate(false);
	};

	const handleCancel = () => {
		setShowCreate(false);
		setNewOrgName("");
	};

	if (!showCreate) {
		return (
			<Button
				type="button"
				variant="ghost"
				size="sm"
				onClick={() => setShowCreate(true)}
				className="w-min text-muted-foreground"
			>
				<Plus className="size-6" />
				<span className="font-extrabold text-16-medium">
					Create new organization
				</span>
			</Button>
		);
	}

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				handleCreate();
			}}
			className="flex items-center gap-1.5"
		>
			<Input
				type="text"
				value={newOrgName}
				onChange={(e) => setNewOrgName(e.target.value)}
				placeholder="Organization name"
				className="w-full text-16-medium no-ring"
				autoFocus
			/>
			<Button
				type="submit"
				size="sm"
				disabled={!newOrgName.trim()}
				className="shrink-0"
			>
				Create
			</Button>
			<Button
				type="button"
				variant="ghost"
				size="icon-sm"
				onClick={handleCancel}
			>
				<X className="size-3.5" />
			</Button>
		</form>
	);
};

export default CreateOrganizationForm;
