"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { tryCatch } from "@repo/utils";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ActionResponse } from "@/lib/types/global";
import {
	AddMemberSchema,
	ASSIGNABLE_ROLES,
} from "@/lib/validations/organization";

type AddMemberFormProps = {
	onSubmit: (data: z.infer<typeof AddMemberSchema>) => Promise<ActionResponse>;
};

const AddMemberForm = ({ onSubmit }: AddMemberFormProps) => {
	const form = useForm<z.infer<typeof AddMemberSchema>>({
		resolver: zodResolver(AddMemberSchema),
		defaultValues: {
			email: "",
			role: "member",
		},
	});

	const handleSubmit = async (data: z.infer<typeof AddMemberSchema>) => {
		const [result, error] = await tryCatch(() => onSubmit(data));

		if (error) return toast.error(error.message);

		if (result?.success) {
			toast.success("Member added successfully");
			form.reset();
			return;
		}

		toast.error(result?.error?.message);
	};

	return (
		<Card className="w-full bg-muted">
			<CardContent>
				<form id="add-member-form" onSubmit={form.handleSubmit(handleSubmit)}>
					<FieldGroup>
						<Controller
							name="email"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="email">Email</FieldLabel>
									<Input
										{...field}
										id="email"
										type="email"
										placeholder="user@example.com"
										aria-invalid={fieldState.invalid}
										className="no-ring"
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>

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
						form="add-member-form"
						type="submit"
					>
						Add Member
					</Button>
				</Field>
			</CardFooter>
		</Card>
	);
};

export default AddMemberForm;
