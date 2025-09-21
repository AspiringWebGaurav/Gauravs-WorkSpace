'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { X, Home, FolderOpen, FileText, Settings, Download } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCurrentYear } from '@/hooks/useHydrationSafe';
import { NAVIGATION_LINKS, isActiveLink } from '@/lib/constants';
import { MovingBorderButton } from '@/components/ui/moving-border';
import { downloadFile } from '@/lib/downloadUtils';

// Animation variants
const overlayVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1 }
};

const drawerVariants = {
  closed: { x: '100%' },
  open: { x: 0 }
};

const containerVariants = {
  closed: {},
  open: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  closed: { opacity: 0, x: 20 },
  open: { opacity: 1, x: 0 }
};

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
}

export default function DrawerMenu({ isOpen, onClose, currentPath }: DrawerMenuProps) {
  const [mounted, setMounted] = useState(false);
  const currentYear = useCurrentYear();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDownloadResume = async () => {
    try {
      // Use existing download utility
      downloadFile('/resume.pdf', 'Gaurav_Patil_Resume.pdf');
    } catch (error) {
      console.error('Resume download failed:', error);
      // You can add toast notification here if needed
    }
  };

  // Don't render on server
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          
          {/* Drawer Panel */}
          <motion.div
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="absolute right-0 top-0 h-full w-full max-w-sm sm:w-[400px] bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-2xl rounded-l-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
          >
            <div className="flex h-full flex-col">
              
              {/* Header */}
              <motion.div 
                variants={itemVariants}
                className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 min-h-[60px]"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden">
                    <Image
                      src="/icon-512x512.png"
                      alt="Gaurav Workspace"
                      fill
                      sizes="32px"
                      className="object-contain"
                    />
                  </div>
                  <span 
                    id="drawer-title"
                    className="font-semibold text-gray-900 dark:text-gray-100 text-lg"
                  >
                    Gaurav Workspace
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Close navigation menu"
                >
                  <X size={20} className="text-gray-700 dark:text-gray-300" />
                </button>
              </motion.div>

              {/* Navigation */}
              <motion.nav 
                variants={containerVariants}
                className="flex-1 p-4 space-y-2"
                role="navigation"
                aria-label="Main navigation"
              >
                {NAVIGATION_LINKS.map((item, index) => {
                  const active = isActiveLink(currentPath, item.href);
                  const Icon = item.icon;
                  
                  return (
                    <motion.div
                      key={item.href}
                      variants={itemVariants}
                      custom={index}
                    >
                      {active ? (
                        <MovingBorderButton
                          as={Link}
                          href={item.href}
                          borderRadius="0.875rem"
                          className="w-full justify-start p-4 text-base font-medium shadow-lg min-h-[56px]"
                          duration={4000}
                        >
                          <Icon size={20} />
                          {item.label}
                        </MovingBorderButton>
                      ) : (
                        <Link
                          href={item.href}
                          className="flex items-center gap-3 w-full p-4 rounded-xl text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-all duration-200 active:scale-[0.98] min-h-[56px]"
                        >
                          <Icon size={20} />
                          {item.label}
                        </Link>
                      )}
                    </motion.div>
                  );
                })}
              </motion.nav>

              {/* Resume Download Button */}
              <motion.div 
                variants={itemVariants}
                className="p-4 border-t border-gray-200 dark:border-gray-700"
              >
                <button
                  onClick={handleDownloadResume}
                  className="w-full flex items-center justify-center gap-3 p-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg min-h-[60px] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <Download size={20} />
                  Download Resume
                </button>
              </motion.div>

              {/* Footer */}
              <motion.div 
                variants={itemVariants}
                className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 min-h-[40px]"
              >
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="inline-flex items-center justify-center w-6 h-6 rounded bg-indigo-600 text-white font-semibold text-xs">
                    GW
                  </div>
                  <span>© {currentYear} Gaurav Patil</span>
                </div>
              </motion.div>
              
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}