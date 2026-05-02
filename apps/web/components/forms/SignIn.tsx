import { zodResolver } from "@hookform/resolvers/zod";
import { tryCatch } from "@repo/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { ActionResponse } from "@/lib/types/global";
import { SignInSchema } from "@/lib/validations/auth/sign-in";

type SignInProps = {
	onSubmit: (data: z.infer<typeof SignInSchema>) => Promise<ActionResponse>;
};

const SignIn = ({ onSubmit }: SignInProps) => {
	const router = useRouter();

	const form = useForm<z.infer<typeof SignInSchema>>({
		resolver: zodResolver(SignInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const handleSubmit = async (data: z.infer<typeof SignInSchema>) => {
		const [result, error] = await tryCatch(onSubmit(data));

		if (error) return toast.error(error.message);

		if (result?.success) {
			toast.success("Sign in successful");
			return router.replace(ROUTES.HOME);
		}

		toast.error(result?.error?.message);
	};

	return (
		<Card className="w-full sm:max-w-md">
			<CardHeader>
				<CardTitle>Sign In</CardTitle>
				<CardDescription>
					Welcome back, please enter your details
				</CardDescription>
			</CardHeader>

			<CardContent>
				<form id="signin-form" onSubmit={form.handleSubmit(handleSubmit)}>
					<FieldGroup>
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
					</FieldGroup>
				</form>
			</CardContent>

			<CardFooter className="flex flex-col gap-3">
				<Field orientation="responsive">
					<Button form="signin-form" type="submit">
						Sign In
					</Button>
				</Field>

				<p className="text-sm text-muted-foreground text-center w-full">
					Don’t have an account?{" "}
					<Link
						href={ROUTES.SIGN_UP}
						className="text-primary font-medium hover:underline"
					>
						Sign up
					</Link>
				</p>
			</CardFooter>
		</Card>
	);
};

export default SignIn;
