import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "sonner";
import { clientEnv } from "@/lib/validations/env/client";

const inter = Inter({
	subsets: ["vietnamese"],
	weight: ["300", "400", "500", "600", "700", "800", "900"],
	variable: "--font-sans",
});

const space = Space_Grotesk({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
	variable: "--font-space",
});

export const metadata: Metadata = {
	metadataBase: new URL(clientEnv.NEXT_PUBLIC_URL),
	title: "DerivPA KYC Verification",
	description: "Secure identity verification for DerivPA clients.",
	robots: {
		index: false,
		follow: false,
		nocache: true,
		googleBot: {
			index: false,
			follow: false,
			noimageindex: true,
		},
	},
	openGraph: {
		title: "DerivPA KYC Verification",
		description: "Secure identity verification for DerivPA clients.",
		siteName: "DerivPA",
		type: "website",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={`${inter.className} ${space.variable} h-full antialiased`}
		>
			<body className="min-h-full flex flex-col">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{children}
				</ThemeProvider>
				<Toaster richColors />
			</body>
		</html>
	);
}
