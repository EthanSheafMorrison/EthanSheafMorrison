import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import GridOverlay from "@/components/GridOverlay";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ethansheaf.com"),
  title: { default: "Ethan Sheaf Morrison", template: "%s | Ethan Sheaf Morrison" },
  description: "Portfolio and projects by Ethan Sheaf Morrison.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", siteName: "Ethan Sheaf Morrison" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, maximumScale: 5, themeColor: "#f3f0ec" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}
      >
        <Header />
        <main style={{ paddingTop: 'var(--header-h)' }}>
          {children}
        </main>
        <GridOverlay />
      </body>
    </html>
  );
}
