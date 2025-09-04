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
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-sm font-semibold shadow-sm">
              GW
            </span>
            <span className="font-semibold text-lg text-gray-900 dark:text-gray-100 tracking-tight">
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
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200/80 dark:border-gray-800/80 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            aria-label="Toggle navigation"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && mounted && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="md:hidden pb-4"
            >
              <div className="grid gap-2">
                {NAVIGATION_LINKS.map((item) => {
                  const active = isActiveLink(pathname, item.href);
                  const Icon = item.icon;
                  
                  return active ? (
                    <MovingBorderButton
                      key={item.href}
                      as={Link}
                      href={item.href}
                      borderRadius="0.75rem"
                      className="px-3 py-2 text-sm justify-start"
                      duration={4000}
                    >
                      <Icon size={18} />
                      {item.label}
                    </MovingBorderButton>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors text-gray-700 dark:text-gray-300 hover:bg-white/[0.15] dark:hover:bg-black/[0.2] bg-white/[0.08] dark:bg-black/[0.12] border border-white/[0.1] dark:border-white/[0.05]"
                    >
                      <Icon size={18} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
