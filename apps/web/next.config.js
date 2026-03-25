/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ["@repo/db"],
	serverExternalPackages: ["pino, pino-pretty"],
};

export default nextConfig;
