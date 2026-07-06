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
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
					{
						key: "Strict-Transport-Security",
						value: "max-age=63072000; includeSubDomains; preload",
					},
				],
			},
		];
	},
};

export default nextConfig;
