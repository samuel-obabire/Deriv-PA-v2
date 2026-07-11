"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	Button,
	Card,
	CardContent,
	CardFooter,
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@repo/ui";
import { tryCatch } from "@repo/utils";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { ASSIGNABLE_ROLES } from "@/lib/permissions";
import { UpdateMemberRoleSchema } from "@/lib/validations/organization";
import { ActionResponse } from "@/types/global";

type UpdateMemberRoleFormProps = {
	memberId: string;
	userId: string;
	currentRole: string;
	onSubmit: (
		data: z.infer<typeof UpdateMemberRoleSchema>,
	) => Promise<ActionResponse>;
};

const UpdateMemberRoleForm = ({
	memberId,
	userId,
	currentRole,
	onSubmit,
}: UpdateMemberRoleFormProps) => {
	const assignableRole = ASSIGNABLE_ROLES.includes(
		currentRole as (typeof ASSIGNABLE_ROLES)[number],
	)
		? (currentRole as (typeof ASSIGNABLE_ROLES)[number])
		: "member";

	const form = useForm<z.infer<typeof UpdateMemberRoleSchema>>({
		resolver: zodResolver(UpdateMemberRoleSchema),
		defaultValues: {
			memberId,
			userId,
			role: assignableRole,
		},
	});

	const handleSubmit = async (data: z.infer<typeof UpdateMemberRoleSchema>) => {
		const [result, error] = await tryCatch(() => onSubmit(data));

		if (error) return toast.error(error.message);

		if (result?.success) {
			toast.success("Member role updated successfully");
			return;
		}

		toast.error(result?.error?.message);
	};

	return (
		<Card className="w-full">
			<CardContent>
				<form id="update-role-form" onSubmit={form.handleSubmit(handleSubmit)}>
					<FieldGroup>
						<Controller
							name="role"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="role">Role</FieldLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<SelectTrigger
											id="role"
											aria-invalid={fieldState.invalid}
											className="w-full no-ring"
										>
											<SelectValue placeholder="Select a role" />
										</SelectTrigger>
										<SelectContent>
											{ASSIGNABLE_ROLES.map((role) => (
												<SelectItem key={role} value={role}>
													{role.charAt(0).toUpperCase() + role.slice(1)}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
					</FieldGroup>
				</form>
			</CardContent>

			<CardFooter>
				<Field orientation="responsive">
					<Button
						disabled={form.formState.isSubmitting}
						form="update-role-form"
						type="submit"
					>
						Update Role
					</Button>
				</Field>
			</CardFooter>
		</Card>
	);
};

export default UpdateMemberRoleForm;
