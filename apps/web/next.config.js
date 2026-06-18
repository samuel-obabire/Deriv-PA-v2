/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ["@repo/db", "@repo/utils"],
	serverExternalPackages: ["pino, pino-pretty"],
	reactCompiler: true,
	output: "standalone",
};

export default nextConfig;
