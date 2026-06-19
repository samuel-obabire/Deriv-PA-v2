import type { Metadata } from "next";
import "./globals.css";
import { Inter, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import TanstackClientProvider from "@/components/providers/QueryClientProvider";

const space = Space_Grotesk({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
	variable: "--font-space",
});

const inter = Inter({
	subsets: ["vietnamese"],
	weight: ["300", "400", "500", "600", "700", "800", "900"],
	variable: "--font-sans",
});

export const metadata: Metadata = {
	title: "DerivPA",
	description: "Payment agent management platform for Deriv partners",
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
			className={`${inter.className} ${space.variable}`}
		>
			<body className="antialiased">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<TanstackClientProvider>
						<NuqsAdapter>
							<div>{children}</div>
						</NuqsAdapter>
					</TanstackClientProvider>

					<Toaster richColors />
				</ThemeProvider>
			</body>
		</html>
	);
}
