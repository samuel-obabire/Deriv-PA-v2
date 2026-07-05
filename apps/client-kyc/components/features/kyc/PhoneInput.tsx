"use client";

import { cn } from "@repo/ui";
import "react-phone-number-input/style.css";

import PhoneInputPrimitive, { type Country } from "react-phone-number-input";

type PhoneInputProps = {
	id?: string;
	value?: string;
	onChange: (value: string | undefined) => void;
	defaultCountry?: Country;
	placeholder?: string;
	className?: string;
};

const PhoneInput = ({
	id,
	value,
	onChange,
	defaultCountry = "NG",
	placeholder,
	className,
}: PhoneInputProps) => {
	return (
		<div className={cn("kyc-phone-input", className)}>
			<PhoneInputPrimitive
				id={id}
				international
				defaultCountry={defaultCountry}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
			/>
		</div>
	);
};

export default PhoneInput;
