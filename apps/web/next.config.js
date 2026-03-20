/** @type {import('next').NextConfig} */
const nextConfig = {
	allowedDevOrigins: ["http://localhost:3000"],
	transpilePackages: ["@repo/db"],
};

export default nextConfig;
