"use client";

import { useContext } from "react";
import { StatementContext } from "@/context/StatementOptionsProvider";

const useStatementOptions = () => {
	const context = useContext(StatementContext);

	if (!context)
		throw new Error(
			"useStatementOptions must be called within StatementOptionsProvider",
		);

	return context;
};

export default useStatementOptions;
