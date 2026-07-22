"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ClientKycRecord } from "@repo/db";
import {
	Button,
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	Input,
} from "@repo/ui";
import { tryCatch } from "@repo/utils";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { EditClientKycRecordSchema } from "@/lib/validations/kyc";
import { ActionResponse } from "@/types/global";

type EditClientKycRecordFormProps = {
	record: ClientKycRecord;
	onSubmit: (
		data: z.output<typeof EditClientKycRecordSchema>,
	) => Promise<ActionResponse>;
};

const EditClientKycRecordForm = ({
	record,
	onSubmit,
}: EditClientKycRecordFormProps) => {
	const defaultValues: z.input<typeof EditClientKycRecordSchema> = {
		recordId: record.id,
		fullName: record.fullName,
		email: record.email ?? "",
		derivNickname: record.derivNickname,
		externalReferenceId: record.externalReferenceId,
		whatsappNumber: record.whatsappNumber ?? "",
	};

	const form = useForm<
		z.input<typeof EditClientKycRecordSchema>,
		unknown,
		z.output<typeof EditClientKycRecordSchema>
	>({
		resolver: zodResolver(EditClientKycRecordSchema),
		defaultValues,
	});

	const handleSubmit = async (
		data: z.output<typeof EditClientKycRecordSchema>,
	) => {
		const [result, error] = await tryCatch(() => onSubmit(data));

		if (error) return toast.error(error.message);
		if (!result?.success)
			return toast.error(
				result?.error?.message ?? "Failed to update KYC record",
			);

		toast.success("KYC record updated");
		form.reset(data);
	};

	return (
		<form
			id="edit-kyc-record-form"
			onSubmit={form.handleSubmit(handleSubmit)}
			className="space-y-8"
			autoComplete="off"
		>
			<FieldGroup>
				<div className="grid gap-5 sm:grid-cols-2">
					<Controller
						name="fullName"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="fullName">Full name</FieldLabel>
								<Input
									id="fullName"
									placeholder="As it appears on their ID"
									aria-invalid={fieldState.invalid}
									className="no-ring"
									{...field}
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<Controller
						name="email"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<Input
									id="email"
									type="email"
									placeholder="client@example.com"
									aria-invalid={fieldState.invalid}
									className="no-ring"
									{...field}
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
				</div>

				<div className="grid gap-5 sm:grid-cols-2">
					<Controller
						name="derivNickname"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="derivNickname">Deriv nickname</FieldLabel>
								<Input
									id="derivNickname"
									placeholder="Client's Deriv account nickname"
									aria-invalid={fieldState.invalid}
									className="no-ring"
									{...field}
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<Controller
						name="externalReferenceId"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="externalReferenceId">Client ID</FieldLabel>
								<Input
									id="externalReferenceId"
									placeholder="Client's Deriv client ID"
									aria-invalid={fieldState.invalid}
									className="no-ring"
									{...field}
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
				</div>

				<Controller
					name="whatsappNumber"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field
							data-invalid={fieldState.invalid}
							className="sm:max-w-[calc(50%-0.625rem)]"
						>
							<FieldLabel htmlFor="whatsappNumber">WhatsApp number</FieldLabel>
							<Input
								id="whatsappNumber"
								type="tel"
								placeholder="Enter WhatsApp number"
								aria-invalid={fieldState.invalid}
								className="no-ring"
								{...field}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
			</FieldGroup>

			<div className="flex justify-end border-t pt-6">
				<Button
					disabled={form.formState.isSubmitting}
					form="edit-kyc-record-form"
					type="submit"
				>
					Save Changes
				</Button>
			</div>
		</form>
	);
};

export default EditClientKycRecordForm;
