import type { Metadata } from "next";
import { oswald } from "./fonts/font";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
	title: "Collaborative Presentation Software",
	description: "Create and share presentations in real-time with others.",
	icons: {
		icon: "/logo.png",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={"dark"}>
			<body
				className={`${oswald.className} overflow-x-hidden lg:overflow-y-hidden antialiased h-auto pb-10 w-screen`}
			>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
