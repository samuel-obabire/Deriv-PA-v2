/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ["@repo/db", "@repo/utils"],
	serverExternalPackages: ["pino, pino-pretty"],
};

export default nextConfig;
