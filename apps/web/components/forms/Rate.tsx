import { zodResolver } from "@hookform/resolvers/zod";
import { Rate } from "@repo/db";
import { tryCatch } from "@repo/utils";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RateUpdateSchema } from "@/lib/validations/rate";

type SignInProps = {
	onSubmit: (data: z.infer<typeof RateUpdateSchema>) => Promise<ActionResponse>;
	rate: Rate;
};

const RateForm = ({ onSubmit, rate }: SignInProps) => {
	const form = useForm<z.infer<typeof RateUpdateSchema>>({
		resolver: zodResolver(RateUpdateSchema),
		defaultValues: {
			deposit: rate.deposit,
			withdrawal: rate.withdrawal,
			charge: rate.charge,
			smallAmount: rate.smallAmount,
		},
	});

	const handleSubmit = async (data: z.infer<typeof RateUpdateSchema>) => {
		const [result, error] = await tryCatch(onSubmit(data));

		if (error) return toast.error(error.message);

		if (result?.success) return toast.success("Rate updated successfully");

		toast.error(result?.error?.message);
	};

	return (
		<Card className="w-full bg-muted">
			<CardContent>
				<form id="signin-form" onSubmit={form.handleSubmit(handleSubmit)}>
					<FieldGroup>
						<Controller
							name="deposit"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="deposit">
										Deposit Rate (NGN/USD)
									</FieldLabel>
									<Input
										{...field}
										id="deposit"
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
							name="withdrawal"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="withdrawal">
										Withdrawal Rate (NGN/USD)
									</FieldLabel>
									<Input
										{...field}
										id="withdrawal"
										aria-invalid={fieldState.invalid}
										className="no-ring"
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
									<FieldDescription>
										Rates are used to calculate expected payout amounts during
										reconciliation. Updates apply to all pending batches.
									</FieldDescription>
								</Field>
							)}
						/>

						<Controller
							name="smallAmount"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="smallAmount">Small amount</FieldLabel>
									<Input
										{...field}
										id="smallAmount"
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
							name="charge"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="charge">
										Charge for orders less then small amount
									</FieldLabel>
									<Input
										{...field}
										id="charge"
										aria-invalid={fieldState.invalid}
										className="no-ring"
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
									<FieldDescription>Charge for small amounts</FieldDescription>
								</Field>
							)}
						/>
					</FieldGroup>
				</form>
			</CardContent>

			<CardFooter className="flex flex-col gap-3">
				<Field orientation="responsive">
					<Button
						disabled={form.formState.isSubmitting}
						form="signin-form"
						type="submit"
					>
						Update Rates
					</Button>
				</Field>
			</CardFooter>
		</Card>
	);
};

export default RateForm;
