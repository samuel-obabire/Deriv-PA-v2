import { Currency } from "@repo/db";
import Image from "next/image";
import { useState } from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import useCurrency from "@/hooks/useCurrency";
import { CURRENCY_ICON } from "@/lib/utils/deriv";
import Balance from "./Balance";

export function CurrencyPopOver({
	selectedCurrency,
	currencyList,
	onCurrencyChange,
}: {
	selectedCurrency: string | null;
	currencyList: Omit<Currency, "token">[];
	onCurrencyChange: (selectedCurrency: string) => void;
}) {
	const [open, setOpen] = useState(false);

	return (
		<div className="flex gap-6">
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<button type="button">
						<Balance currency={selectedCurrency} />
					</button>
				</PopoverTrigger>

				<PopoverContent align="end" className="w-52 p-2">
					<div className="flex flex-col gap-1">
						{currencyList.map((currency) =>
							currency.code !== selectedCurrency ? (
								<button
									key={currency.id}
									type="button"
									onClick={() => {
										onCurrencyChange(currency.code);
										setOpen(false);
									}}
									className="flex items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none"
								>
									<Image
										src={CURRENCY_ICON[currency.code] ?? CURRENCY_ICON.DEFAULT}
										alt={currency.code}
										width={24}
										height={24}
									/>
									<div className="flex flex-col">
										<span className="text-sm font-medium leading-none">
											{currency.label}
										</span>
										<span className="text-xs text-muted-foreground mt-0.5">
											{currency.code}
										</span>
									</div>
								</button>
							) : null,
						)}
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}

const CurrencySwitcher = () => {
	const { currencyList, onCurrencyChange, selectedCurrency } = useCurrency();

	return (
		<CurrencyPopOver
			currencyList={currencyList}
			selectedCurrency={selectedCurrency}
			onCurrencyChange={onCurrencyChange}
		/>
	);
};

export default CurrencySwitcher;
