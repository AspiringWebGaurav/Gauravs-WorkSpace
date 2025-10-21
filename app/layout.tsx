import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Breadcrumbs from "@/components/Breadcrumbs";
import { AppProviders } from "@/components/AppProviders";
import LayoutWrapper from "@/components/LayoutWrapper";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.gauravworkspace.store";
const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Gaurav Workspace";
const description =
  "Lightning-fast work overview for HR & recruiters. Access resume, portfolio, and VibeCoding beta effortlessly.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: appName,
    template: `%s | ${appName}`,
  },
  description,
  applicationName: appName,
  keywords: [
    "Gaurav Patil",
    "Gaurav Workspace",
    "Product Engineer",
    "Resume",
    "Recruiting",
    "Portfolio",
  ],
  authors: [{ name: "Gaurav Patil", url: "https://www.gauravpatil.online" }],
  openGraph: {
    title: appName,
    description,
    url: siteUrl,
    siteName: appName,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${appName} - overview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: appName,
    description,
    images: ["/og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
    other: [
      { rel: "icon", url: "/icon-192.png" },
      { rel: "icon", url: "/icon-512.png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans text-base`}>
        <AppProviders>
          <div className="flex min-h-screen flex-col w-full">
            <Breadcrumbs />
            <main className="flex-1 lg:flex-none w-full">
              <LayoutWrapper>{children}</LayoutWrapper>
            </main>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
