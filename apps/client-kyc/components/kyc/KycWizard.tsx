import WizardProgress from "./WizardProgress";

interface StepItem {
	title: string;
	component: React.ReactNode;
}

interface KycWizardProps {
	currentStep: number;
	steps: StepItem[];
}

const KycWizard = ({ currentStep, steps }: KycWizardProps) => {
	const totalSteps = steps.length;
	const activeStep = steps[currentStep - 1];

	if (!activeStep) return null;

	return (
		<div className="w-full max-w-lg mx-auto px-4 py-10">
			<WizardProgress
				currentStep={currentStep}
				totalSteps={totalSteps}
				title={activeStep.title}
			/>
			<div>{activeStep.component}</div>
		</div>
	);
};

export default KycWizard;
