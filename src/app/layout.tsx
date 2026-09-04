import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/providers/Provider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "Nishank Gurung | Full-Stack Software Engineer",
        template: "%s | Nishank Gurung",
    },
    description:
        "Full-Stack Software Engineer specializing in React, Next.js, React Native, Node.js, and scalable web architectures.",
    keywords: [
        "Nishank Gurung",
        "Full Stack Developer",
        "Software Engineer",
        "React",
        "Next.js",
        "React Native",
        "TypeScript",
        "Node.js",
        "PostgreSQL",
        "Portfolio",
    ],
    authors: [{ name: "Nishank Gurung" }],
    creator: "Nishank Gurung",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://nishankgurung.com.np",
        title: "Nishank Gurung | Full-Stack Software Engineer",
        description:
            "Full-Stack Software Engineer specializing in React, Next.js, React Native, Node.js, and scalable web architectures.",
        siteName: "Nishank Gurung Portfolio",
    },
    twitter: {
        card: "summary_large_image",
        title: "Nishank Gurung | Full-Stack Software Engineer",
        description:
            "Full-Stack Software Engineer specializing in React, Next.js, React Native, and Node.js.",
    },
    icons: {
        icon: "/favicon.ico",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <NextTopLoader height={5} color="#658f50" />
                <Providers>{children}</Providers>
                <Toaster closeButton />
            </body>
        </html>
    );
}
