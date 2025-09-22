import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { ThreeDMarquee } from '@/components/ui/3d-marquee';
import ToastProvider from '@/components/providers/ToastProvider';

// Global workspace images for the 3D Marquee background
const WORKSPACE_IMAGES = [
  "/icon-512x512.png",
  "/logo-1024.png",
  "/og-image.png",
  "/window.svg",
  "/file.svg",
  "/globe.svg",
];

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function Layout({ children, className = "" }: LayoutProps) {
  return (
    <div className="h-dvh overflow-hidden flex flex-col">
      {/* 3D Marquee Background Layer */}
      <ThreeDMarquee
        images={WORKSPACE_IMAGES}
        className="fixed inset-0 z-0"
        direction="up"
        pauseOnHover={true}
      />
      
      {/* Unified Background Layers - Single system for entire page */}
      {/* Layer 1: Dark overlay for readability */}
      <div className="fixed inset-0 bg-black/20 dark:bg-black/40 z-[1]"></div>
      
      {/* Layer 2: Backdrop blur effect */}
      <div className="fixed inset-0 backdrop-blur-sm z-[2]"></div>
      
      {/* Layer 3: Subtle gradient overlay for better focus */}
      <div className="fixed inset-0 bg-gradient-radial from-transparent via-white/5 to-white/10 dark:via-black/10 dark:to-black/20 z-[3]"></div>
      
      {/* Skip link for accessibility */}
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 z-50 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow"
      >
        Skip to main content
      </a>

      <ToastProvider>
        <div className="relative flex h-full flex-col z-10">
          {/* Fixed-height Navbar */}
          <Navbar />
          
          {/* Main content area that grows to fill available space */}
          <main id="content" className={`flex-1 relative z-10 overflow-hidden ${className}`}>
            {children}
          </main>
          
          {/* Auto-height Footer */}
          <Footer />
        </div>
      </ToastProvider>
    </div>
  );
}