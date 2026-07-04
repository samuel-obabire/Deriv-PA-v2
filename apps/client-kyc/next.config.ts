import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	transpilePackages: ["@repo/ui"],
	reactCompiler: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "*.ufs.sh",
			},
		],
	},
	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					{
						key: "X-Robots-Tag",
						value: "noindex, nofollow, noimageindex",
					},
				],
			},
		];
	},
};

export default nextConfig;
