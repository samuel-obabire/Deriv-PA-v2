"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CLIENT_CUSTOMER_TYPE } from "@repo/db/enums";
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
import { ActionResponse } from "@/lib/types/global";
import { CreateKycInviteSchema, CUSTOMER_TYPES } from "@/lib/validations/kyc";

type CreateKycInvitationFormProps = {
	onSubmit: (
		data: z.infer<typeof CreateKycInviteSchema>,
	) => Promise<ActionResponse<{ inviteUrl: string }>>;
	onSuccess: (inviteUrl: string) => void;
};

const CUSTOMER_TYPE_LABELS: Record<(typeof CUSTOMER_TYPES)[number], string> = {
	new: "New client (requires KYC document)",
	existing: "Existing client (no document required)",
};

const CreateKycInvitationForm = ({
	onSubmit,
	onSuccess,
}: CreateKycInvitationFormProps) => {
	const form = useForm<z.infer<typeof CreateKycInviteSchema>>({
		resolver: zodResolver(CreateKycInviteSchema),
		defaultValues: {
			customerType: CLIENT_CUSTOMER_TYPE.NEW,
		},
	});

	const handleSubmit = async (data: z.infer<typeof CreateKycInviteSchema>) => {
		const [result, error] = await tryCatch(() => onSubmit(data));

		if (error) return toast.error(error.message);
		if (!result?.success) return toast.error(result?.error?.message);

		if (result.data) onSuccess(result.data.inviteUrl);
	};

	return (
		<Card className="w-full bg-muted">
			<CardContent>
				<form
					id="create-kyc-invitation-form"
					onSubmit={form.handleSubmit(handleSubmit)}
				>
					<FieldGroup>
						<Controller
							name="customerType"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="customerType">KYC Document</FieldLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<SelectTrigger
											id="customerType"
											aria-invalid={fieldState.invalid}
											className="w-full no-ring"
										>
											<SelectValue placeholder="Select an option" />
										</SelectTrigger>
										<SelectContent>
											{CUSTOMER_TYPES.map((type) => (
												<SelectItem key={type} value={type}>
													{CUSTOMER_TYPE_LABELS[type]}
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
						form="create-kyc-invitation-form"
						type="submit"
					>
						Generate Invite Link
					</Button>
				</Field>
			</CardFooter>
		</Card>
	);
};

export default CreateKycInvitationForm;
