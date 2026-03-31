import { StatConfig, StatItem, StatsType } from "@/lib/types/stats";

export const buildStatItems = (stats: StatsType[], statsConfig: StatConfig) => {
	const statItems = stats.reduceRight((acc, curr) => {
		const config = statsConfig.find(({ type }) => type === curr.type);

		if (config) acc.push({ ...config, ...curr });

		return acc;
	}, [] as StatItem[]);

	return statItems;
};
