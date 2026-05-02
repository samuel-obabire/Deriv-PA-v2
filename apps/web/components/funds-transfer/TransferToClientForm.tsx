"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { TransferToClientSchema } from "@/lib/validations/deriv/transfer-to-client";

type TransferToClientFormProps = {
	isPending: boolean;
	initialData: {
		clientAccount: string;
		amount: string;
		description?: string;
	};
	onSubmit: (data: z.infer<typeof TransferToClientSchema>) => Promise<void>;
};

const TransferToClientForm = ({
	initialData,
	isPending,
	onSubmit,
}: TransferToClientFormProps) => {
	const form = useForm<z.infer<typeof TransferToClientSchema>>({
		resolver: zodResolver(TransferToClientSchema),
		defaultValues: initialData,
	});

	const handleSubmit = async (data: z.infer<typeof TransferToClientSchema>) => {
		await onSubmit(data);
	};

	return (
		<div className="space-y-6">
			<form
				id="transfer-to-client-form"
				onSubmit={form.handleSubmit(handleSubmit)}
			>
				<FieldGroup>
					<Controller
						name="clientAccount"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="clientAccount">Client Account</FieldLabel>
								<Input
									{...field}
									className="input-class"
									id="clientAccount"
									aria-invalid={fieldState.invalid}
									placeholder="Enter client account"
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<Controller
						name="amount"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="amount">Amount</FieldLabel>
								<Input
									{...field}
									className="input-class"
									id="amount"
									aria-invalid={fieldState.invalid}
									placeholder="Enter amount"
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<Controller
						name="description"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="description">Description</FieldLabel>
								<Input
									{...field}
									className="input-class"
									id="description"
									aria-invalid={fieldState.invalid}
									placeholder="Enter description"
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
				</FieldGroup>
			</form>

			<div className="flex flex-col gap-3">
				<Button
					className="ml-auto"
					size="lg"
					form="transfer-to-client-form"
					type="submit"
					disabled={isPending}
				>
					Transfer
				</Button>
			</div>
		</div>
	);
};

export default TransferToClientForm;
