"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MovingBorderButton } from "@/components/ui/moving-border";
import { NAVIGATION_LINKS, isActiveLink } from "@/lib/constants";
import { useHydrationSafe } from "@/hooks/useHydrationSafe";
import DrawerMenu from "@/components/ui/DrawerMenu";

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
      className="relative w-full z-50 transition-all"
      style={{ height: 'clamp(3rem, 5vh, 4rem)' }}
    >
      {/* Enhanced overlay when scrolled (maintains interaction functionality) */}
      <div
        className={[
          "absolute inset-0 transition-all duration-300 z-[4]",
          scrolled
            ? "bg-black/5 dark:bg-black/10"
            : "bg-transparent"
        ].join(" ")}
      ></div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 h-full">
        <div className="flex h-full items-center justify-between">
          {/* Brand */}
          <Link href="/" className="transition-all duration-200 active:scale-[0.98] active:opacity-80 flex items-center gap-2 sm:gap-3 p-1 rounded-lg">
            <div className="relative rounded-xl overflow-hidden shadow-sm min-h-[44px] min-w-[44px]" style={{
              width: 'clamp(2.5rem, 4vh, 3rem)',
              height: 'clamp(2.5rem, 4vh, 3rem)'
            }}>
              <Image
                src="/icon-512x512.png"
                alt="Gaurav Workspace logo"
                fill
                sizes="(max-width: 640px) 40px, 48px"
                className="object-contain"
                priority
              />
            </div>
            <span className="font-semibold text-gray-900 dark:text-gray-100 tracking-tight" style={{
              fontSize: 'clamp(1rem, 2.5vh, 1.125rem)'
            }}>
              Gaurav Workspace
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
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors bg-white/[0.05] dark:bg-black/[0.08] text-gray-700 dark:text-gray-300 border border-white/[0.1] dark:border-white/[0.05] hover:text-gray-900 dark:hover:text-white hover:bg-white/[0.12] dark:hover:bg-black/[0.15]"
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
            className="md:hidden min-h-[44px] min-w-[44px] transition-all duration-200 active:scale-95 inline-flex items-center justify-center rounded-xl border border-gray-200/80 dark:border-gray-800/80 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/10 dark:hover:bg-black/10 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            style={{
              width: 'clamp(2.75rem, 4vh, 3rem)',
              height: 'clamp(2.75rem, 4vh, 3rem)'
            }}
            aria-label="Toggle navigation"
            aria-expanded={open ? "true" : "false"}
          >
            <motion.div
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </motion.div>
          </button>
        </div>

        {/* Mobile Drawer Menu */}
        <DrawerMenu
          isOpen={open}
          onClose={() => setOpen(false)}
          currentPath={pathname}
        />
      </div>
    </nav>
  );
}
