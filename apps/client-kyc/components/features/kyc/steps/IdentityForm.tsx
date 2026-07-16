"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	Button,
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	Input,
} from "@repo/ui";
import { Controller, useForm } from "react-hook-form";
import type * as z from "zod";
import { IdentitySchema } from "@/lib/validations/kyc";

type Props = {
	defaultValues?: Partial<z.infer<typeof IdentitySchema>>;
	onNext: (data: z.infer<typeof IdentitySchema>) => void;
};

const IdentityForm = ({ defaultValues, onNext }: Props) => {
	const form = useForm<z.infer<typeof IdentitySchema>>({
		resolver: zodResolver(IdentitySchema),
		defaultValues: {
			fullName: "",
			derivNickname: "",
			externalReferenceId: "",
			...defaultValues,
		},
	});

	return (
		<form id="identity-form" onSubmit={form.handleSubmit(onNext)}>
			<FieldGroup>
				<Controller
					name="fullName"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="fullName">Full name</FieldLabel>
							<Input
								id="fullName"
								placeholder="As it appears on your ID"
								aria-invalid={fieldState.invalid}
								{...field}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<Controller
					name="derivNickname"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="derivNickname">Deriv nickname</FieldLabel>
							<Input
								id="derivNickname"
								placeholder="Your Deriv account nickname"
								aria-invalid={fieldState.invalid}
								{...field}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
								placeholder="Your Deriv client ID"
								aria-invalid={fieldState.invalid}
								{...field}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
			</FieldGroup>

			<Field className="mt-8">
				<Button
					type="submit"
					form="identity-form"
					disabled={form.formState.isSubmitting}
					className="w-full"
				>
					Continue
				</Button>
			</Field>
		</form>
	);
};

export default IdentityForm;
