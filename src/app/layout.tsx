import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ToastProvider from "@/components/providers/ToastProvider";
import { AuroraBackground } from "@/components/ui/aurora-background";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gaurav's Workspace - Full Stack Developer Portfolio",
  description:
    "Welcome to Gaurav Patil's portfolio workspace. Explore my projects, download my resume, and discover my work in web development, AI integration, and more.",
  keywords: [
    "Gaurav Patil",
    "Full Stack Developer",
    "Portfolio",
    "Web Development",
    "React",
    "Next.js",
    "Firebase",
  ],
  authors: [{ name: "Gaurav Patil" }],
  creator: "Gaurav Patil",
  openGraph: {
    title: "Gaurav's Workspace - Full Stack Developer Portfolio",
    description:
      "Welcome to Gaurav Patil's portfolio workspace. Explore my projects, download my resume, and discover my work in web development, AI integration, and more.",
    url: "https://gauravs-workspace.vercel.app",
    siteName: "Gaurav's Workspace",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gaurav's Workspace - Full Stack Developer Portfolio",
    description:
      "Welcome to Gaurav Patil's portfolio workspace. Explore my projects, download my resume, and discover my work in web development, AI integration, and more.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth [color-scheme:light_dark]">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-dvh flex flex-col`}
      >
        {/* Aurora Background Layer */}
        <AuroraBackground />
        
        {/* Skip link for accessibility */}
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 z-50 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow"
        >
          Skip to main content
        </a>

        <ToastProvider>
          <div className="relative flex min-h-dvh flex-col z-10">
            <Navbar />
            <main id="content" className="flex-1 pt-16 relative z-10">
              <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
            <Footer />
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
