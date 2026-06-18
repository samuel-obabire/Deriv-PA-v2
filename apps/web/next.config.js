/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ["@repo/db", "@repo/utils"],
	serverExternalPackages: ["pino, pino-pretty"],
	reactCompiler: true,
};

export default nextConfig;
