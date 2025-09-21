import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/components/providers/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gaurav Workspace",
  description: "Your personal workspace by Gaurav — projects, notes and files in one place.",
  keywords: ["Gaurav Workspace","workspace","projects","files","notes","GW"],
  metadataBase: new URL("https://gauravs-work-space.vercel.app"),
  authors: [{ name: "Gaurav Patil" }],
  creator: "Gaurav Patil",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/icon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    url: "https://gauravs-work-space.vercel.app",
    siteName: "Gaurav Workspace",
    title: "Gaurav Workspace",
    description: "Your personal workspace by Gaurav.",
    images: [{
      url: "/icon-512x512.png",
      width: 512,
      height: 512,
      alt: "Gaurav Workspace"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Gaurav Workspace",
    description: "Your personal workspace by Gaurav.",
    images: ["/icon-512x512.png"]
  },
  robots: {
    index: true,
    follow: true,
  },
};

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: '#0fb9b1',
    colorScheme: 'light dark'
  }
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth [color-scheme:light_dark]">
      <head>
        <link rel="preload" href="/icon-32x32.png" as="image" type="image/png" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Gaurav Workspace",
              "url": "https://gauravs-work-space.vercel.app",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://gauravs-work-space.vercel.app/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Gaurav Workspace",
              "url": "https://gauravs-work-space.vercel.app",
              "logo": "https://gauravs-work-space.vercel.app/icon-512x512.png"
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
