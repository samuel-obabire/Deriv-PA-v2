type Props = {
	currentStep: number;
	totalSteps: number;
	title: string;
};

const WizardProgress = ({ currentStep, totalSteps, title }: Props) => (
	<div className="mb-8">
		<p className="text-sm text-muted-foreground mb-2">
			Step {currentStep} of {totalSteps}
		</p>
		<div className="h-1 w-full bg-muted rounded-full overflow-hidden">
			<div
				className="h-full bg-primary rounded-full transition-all duration-300"
				style={{ width: `${(currentStep / totalSteps) * 100}%` }}
			/>
		</div>
		<h2 className="mt-5 text-xl font-semibold tracking-tight">{title}</h2>
	</div>
);

export default WizardProgress;
