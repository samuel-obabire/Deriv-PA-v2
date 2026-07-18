"use client";

import { createClientKycRecordAction } from "@/lib/actions/kyc/createClientKycRecord";
import CreateClientKycRecordForm from "../forms/CreateClientKycRecord";

const CreateKycRecordSection = () => (
	<CreateClientKycRecordForm onSubmit={createClientKycRecordAction} />
);

export default CreateKycRecordSection;
