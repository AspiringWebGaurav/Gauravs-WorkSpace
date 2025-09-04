import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { AuroraBackground } from '@/components/ui/aurora-background';
import ToastProvider from '@/components/providers/ToastProvider';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function Layout({ children, className = "" }: LayoutProps) {
  return (
    <div className="min-h-dvh flex flex-col">
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
          {/* Full-width Navbar */}
          <Navbar />
          
          {/* Main content area with proper spacing */}
          <main id="content" className={`flex-1 pt-16 relative z-10 ${className}`}>
            {children}
          </main>
          
          {/* Full-width Footer */}
          <Footer />
        </div>
      </ToastProvider>
    </div>
  );
}