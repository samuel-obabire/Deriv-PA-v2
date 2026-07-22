"use client";

import { useState } from "react";
import useKycRecordFilters from "@/hooks/useKycRecordFilters";
import KycRecordsFilterDialog from "./KycRecordsFilterDialog";

export function KycRecordsFilter() {
	const { filters, applyFilters } = useKycRecordFilters();
	const [email, setEmail] = useState(filters.email ?? "");
	const [externalReferenceId, setExternalReferenceId] = useState(
		filters.externalReferenceId ?? "",
	);
	const [derivNickname, setDerivNickname] = useState(
		filters.derivNickname ?? "",
	);
	const [name, setName] = useState(filters.name ?? "");

	const onApply = () => {
		applyFilters({
			email: email.trim() ? email.trim() : undefined,
			externalReferenceId: externalReferenceId.trim()
				? externalReferenceId.trim()
				: undefined,
			derivNickname: derivNickname.trim() ? derivNickname.trim() : undefined,
			name: name.trim() ? name.trim() : undefined,
		});
	};

	const onReset = () => {
		setEmail("");
		setExternalReferenceId("");
		setDerivNickname("");
		setName("");
		applyFilters({});
	};

	const activeFilterCount = [
		filters.email,
		filters.externalReferenceId,
		filters.derivNickname,
		filters.name,
	].filter(Boolean).length;

	return (
		<div>
			<KycRecordsFilterDialog
				onApply={onApply}
				onReset={onReset}
				email={email}
				onEmailChange={setEmail}
				externalReferenceId={externalReferenceId}
				onExternalReferenceIdChange={setExternalReferenceId}
				derivNickname={derivNickname}
				onDerivNicknameChange={setDerivNickname}
				name={name}
				onNameChange={setName}
				activeFilterCount={activeFilterCount}
			/>
		</div>
	);
}
