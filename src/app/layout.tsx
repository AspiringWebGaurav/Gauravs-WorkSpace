import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
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
  title: "Gaurav's Workspace - Full Stack Developer Portfolio",
  description: "Welcome to Gaurav Patil's portfolio workspace. Explore my projects, download my resume, and discover my work in web development, AI integration, and more.",
  keywords: ["Gaurav Patil", "Full Stack Developer", "Portfolio", "Web Development", "React", "Next.js", "Firebase"],
  authors: [{ name: "Gaurav Patil" }],
  creator: "Gaurav Patil",
  openGraph: {
    title: "Gaurav's Workspace - Full Stack Developer Portfolio",
    description: "Welcome to Gaurav Patil's portfolio workspace. Explore my projects, download my resume, and discover my work in web development, AI integration, and more.",
    url: "https://gauravs-workspace.vercel.app",
    siteName: "Gaurav's Workspace",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gaurav's Workspace - Full Stack Developer Portfolio",
    description: "Welcome to Gaurav Patil's portfolio workspace. Explore my projects, download my resume, and discover my work in web development, AI integration, and more.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen flex flex-col overflow-hidden`}
      >
        <ToastProvider>
          <Navbar />
          <main className="flex-1 pt-16">
            {children}
          </main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
