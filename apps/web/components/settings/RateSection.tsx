"use client";
import { Rate } from "@repo/db";
import { use } from "react";
import { updateRate } from "@/lib/actions/rate/updateRate";
import RateForm from "../forms/Rate";

type RateSectionProp = {
	ratePromise: Promise<Rate>;
};

const RateSection = ({ ratePromise }: RateSectionProp) => {
	const rate = use(ratePromise);

	return <RateForm rate={rate} onSubmit={updateRate} />;
};

export default RateSection;
