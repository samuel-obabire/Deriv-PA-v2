"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Field, FieldError, FieldGroup, FieldLabel } from "@repo/ui";
import { Controller, useForm } from "react-hook-form";
import type * as z from "zod";
import PhoneInput from "@/components/features/kyc/PhoneInput";
import { ContactSchema } from "@/lib/validations/kyc";

type Props = {
	defaultValues?: Partial<z.infer<typeof ContactSchema>>;
	onBack: () => void;
	onNext: (data: z.infer<typeof ContactSchema>) => void;
};

const ContactForm = ({ defaultValues, onBack, onNext }: Props) => {
	const form = useForm<z.infer<typeof ContactSchema>>({
		resolver: zodResolver(ContactSchema),
		defaultValues: { whatsappNumber: "", ...defaultValues },
	});

	return (
		<form
			id="contact-form"
			onSubmit={form.handleSubmit(onNext)}
			autoComplete="off"
		>
			<FieldGroup>
				<Controller
					name="whatsappNumber"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="whatsappNumber">WhatsApp number</FieldLabel>
							<PhoneInput
								id="whatsappNumber"
								value={field.value}
								onChange={field.onChange}
								placeholder="Enter WhatsApp number"
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
			</FieldGroup>

			<div className="mt-8 flex gap-3">
				<Button
					type="button"
					variant="outline"
					onClick={onBack}
					disabled={form.formState.isSubmitting}
					className="flex-1"
				>
					Back
				</Button>
				<Button
					type="submit"
					form="contact-form"
					disabled={form.formState.isSubmitting}
					className="flex-1"
				>
					Continue
				</Button>
			</div>
		</form>
	);
};

export default ContactForm;
