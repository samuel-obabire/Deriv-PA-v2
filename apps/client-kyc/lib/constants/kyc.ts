import { KYC_DOCUMENT_TYPE } from "@repo/db/enums";

type DocumentTypeConfig = {
	label: string;
	hasBackView: boolean;
};

export const DOCUMENT_TYPE_CONFIG: Record<
	KYC_DOCUMENT_TYPE,
	DocumentTypeConfig
> = {
	[KYC_DOCUMENT_TYPE.NATIONAL_ID]: { label: "National ID", hasBackView: true },
	[KYC_DOCUMENT_TYPE.INTERNATIONAL_PASSPORT]: {
		label: "International Passport",
		hasBackView: false,
	},
	[KYC_DOCUMENT_TYPE.DRIVERS_LICENSE]: {
		label: "Driver's License",
		hasBackView: true,
	},
	[KYC_DOCUMENT_TYPE.VOTERS_CARD]: { label: "Voter's Card", hasBackView: true },
};

export const documentTypeHasBackView = (type: KYC_DOCUMENT_TYPE): boolean =>
	DOCUMENT_TYPE_CONFIG[type]?.hasBackView ?? false;
