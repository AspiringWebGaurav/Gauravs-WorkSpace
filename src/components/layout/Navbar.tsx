"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MovingBorderButton } from "@/components/ui/moving-border";
import { NAVIGATION_LINKS, isActiveLink } from "@/lib/constants";
import { useHydrationSafe } from "@/hooks/useHydrationSafe";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const mounted = useHydrationSafe();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // close mobile menu on route change
    setOpen(false);
  }, [pathname]);

  return (
    <nav
      className={[
        "fixed inset-x-0 top-0 z-50 transition-all w-full",
        "bg-white/[0.08] dark:bg-black/[0.12] backdrop-blur-md",
        scrolled
          ? "shadow-sm border-b border-white/[0.1] dark:border-white/[0.05]"
          : "border-b border-transparent",
      ].join(" ")}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <Link href="/" className="transition-all duration-200 active:scale-[0.98] active:opacity-80 flex items-center gap-2 sm:gap-3 p-1 rounded-lg">
            <span className="inline-flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-sm font-semibold shadow-sm min-h-[44px] min-w-[44px]">
              GW
            </span>
            <span className="font-semibold text-base sm:text-lg text-gray-900 dark:text-gray-100 tracking-tight">
              Gaurav&apos;s Workspace
            </span>
          </Link>

          {/* Desktop nav - only render after hydration */}
          <div className="hidden md:flex items-center gap-2">
            {mounted && NAVIGATION_LINKS.map((item) => {
              const active = isActiveLink(pathname, item.href);
              const Icon = item.icon;
              
              return active ? (
                <MovingBorderButton
                  key={item.href}
                  as={Link}
                  href={item.href}
                  borderRadius="1.5rem"
                  className="px-3 py-1.5 text-sm"
                  duration={4000}
                >
                  <Icon size={16} />
                  {item.label}
                </MovingBorderButton>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors bg-white/[0.08] dark:bg-black/[0.12] text-gray-700 dark:text-gray-300 border border-white/[0.1] dark:border-white/[0.05] hover:text-gray-900 dark:hover:text-white hover:bg-white/[0.15] dark:hover:bg-black/[0.2]"
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden min-h-[44px] min-w-[44px] transition-all duration-200 active:scale-95 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200/80 dark:border-gray-800/80 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/10 dark:hover:bg-black/10 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label="Toggle navigation"
          >
            <motion.div
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </motion.div>
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && mounted && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                duration: 0.4
              }}
              className="md:hidden pb-6 pt-2"
            >
              <motion.div
                className="grid gap-3 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                {NAVIGATION_LINKS.map((item, index) => {
                  const active = isActiveLink(pathname, item.href);
                  const Icon = item.icon;
                  
                  return active ? (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <MovingBorderButton
                        as={Link}
                        href={item.href}
                        borderRadius="0.875rem"
                        className="min-h-[44px] min-w-[44px] transition-all duration-200 active:scale-95 px-4 py-3 text-base justify-start font-medium shadow-lg active:shadow-md"
                        duration={4000}
                      >
                        <Icon size={20} />
                        {item.label}
                      </MovingBorderButton>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <Link
                        href={item.href}
                        className="min-h-[44px] min-w-[44px] transition-all duration-200 active:scale-[0.98] active:opacity-80 flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/[0.2] dark:hover:bg-black/[0.25] bg-white/[0.08] dark:bg-black/[0.12] border border-white/[0.1] dark:border-white/[0.05] shadow-lg active:shadow-md"
                      >
                        <Icon size={20} />
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
