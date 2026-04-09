import { zodResolver } from "@hookform/resolvers/zod";
import { tryCatch } from "@repo/utils";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import ROUTES from "@/lib/constants/routes";
import { SignUpSchema } from "@/lib/validations/auth/sign-up";

type SignupProps = {
	onSubmit: (data: z.infer<typeof SignUpSchema>) => Promise<ActionResponse>;
};
const Signup = ({ onSubmit }: SignupProps) => {
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
		const { data: result, error } = await tryCatch(onSubmit(data));

		if (error) toast.error(error.message);

		if (result?.success) {
			return toast.success("signup complete");
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
				<form id="signup-form" onSubmit={form.handleSubmit(handleSubmit)}>
					<FieldGroup>
						<Controller
							name="name"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="name">Name</FieldLabel>
									<Input
										{...field}
										className="input-class"
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
										className="input-class"
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
										className="input-class"
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
									<FieldLabel htmlFor="password">Confirm Password</FieldLabel>
									<Input
										{...field}
										className="input-class"
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
