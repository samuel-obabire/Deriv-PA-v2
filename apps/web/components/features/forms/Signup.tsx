"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	Input,
} from "@repo/ui";
import { tryCatch } from "@repo/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import ROUTES from "@/lib/constants/routes";
import { SignUpSchema } from "@/lib/validations/auth/sign-up";
import { ActionResponse } from "@/types/global";

type SignupProps = {
	onSubmit: (data: z.infer<typeof SignUpSchema>) => Promise<ActionResponse>;
};

const Signup = ({ onSubmit }: SignupProps) => {
	const router = useRouter();

	const form = useForm<z.infer<typeof SignUpSchema>>({
		resolver: zodResolver(SignUpSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const handleSubmit = async (data: z.infer<typeof SignUpSchema>) => {
		const [result, error] = await tryCatch(() => onSubmit(data));

		if (error) toast.error(error.message);

		if (result?.success) {
			router.push(ROUTES.DASHBOARD);
			return toast.success("Signup complete");
		} else {
			toast.error(result?.error?.message);
		}
	};

	return (
		<Card className="w-full sm:max-w-md">
			<CardHeader>
				<CardTitle>Create Account</CardTitle>
				<CardDescription>Create an account to start auditing</CardDescription>
			</CardHeader>

			<CardContent>
				<form
					id="signup-form"
					onSubmit={form.handleSubmit(handleSubmit)}
					autoComplete="off"
				>
					<FieldGroup>
						<Controller
							name="name"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="name">Name</FieldLabel>
									<Input
										{...field}
										id="name"
										aria-invalid={fieldState.invalid}
										placeholder="Adeluxe Hub"
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
										{...field}
										id="email"
										aria-invalid={fieldState.invalid}
										placeholder="Enter email"
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>

						<Controller
							name="password"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="password">Password</FieldLabel>
									<Input
										{...field}
										id="password"
										type="password"
										aria-invalid={fieldState.invalid}
										placeholder="Enter password"
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>

						<Controller
							name="confirmPassword"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="confirm-password">
										Confirm Password
									</FieldLabel>
									<Input
										{...field}
										id="confirm-password"
										type="password"
										aria-invalid={fieldState.invalid}
										placeholder="Re-enter password"
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
					</FieldGroup>
				</form>
			</CardContent>

			<CardFooter className="flex flex-col gap-3">
				<Field orientation="responsive">
					<Button form="signup-form" type="submit">
						Submit
					</Button>
				</Field>

				<p className="text-sm text-muted-foreground text-center w-full">
					Already have an account?{" "}
					<Link
						href={ROUTES.SIGN_IN}
						className="text-primary font-medium hover:underline"
					>
						Sign in
					</Link>
				</p>
			</CardFooter>
		</Card>
	);
};

export default Signup;
