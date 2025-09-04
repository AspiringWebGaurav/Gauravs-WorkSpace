"use client";

import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import { usePathname } from "next/navigation";
import { MovingBorderButton } from "@/components/ui/moving-border";
import { NAVIGATION_LINKS, TECH_STACK, SOCIAL_LINKS, isActiveLink } from "@/lib/constants";
import { useCurrentYear, useHydrationSafe } from "@/hooks/useHydrationSafe";

export default function Footer() {
  const year = useCurrentYear();
  const pathname = usePathname();
  const mounted = useHydrationSafe();

  return (
    <footer className="relative w-full backdrop-blur-md bg-white/10 dark:bg-black/10 border-t border-white/[0.15] dark:border-white/[0.08] mt-auto">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Primary row */}
        <div className="py-8 sm:py-12 grid gap-6 sm:gap-8 md:grid-cols-3 items-center">
          {/* Brand / tagline */}
          <div className="flex items-center gap-3 sm:gap-4 transition-all duration-200 active:scale-[0.98] active:opacity-80 p-2 rounded-xl hover:bg-white/5 dark:hover:bg-black/5">
            <div className="inline-flex h-12 w-12 sm:h-10 sm:w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white font-semibold shadow-sm min-h-[44px] min-w-[44px]">
              GW
            </div>
            <div>
              <p className="text-lg xs:text-xl sm:text-2xl leading-tight font-medium text-gray-900 dark:text-gray-100">
                Gaurav&rsquo;s Workspace
              </p>
              <p className="text-xs sm:text-sm leading-relaxed text-gray-500 dark:text-gray-400 mt-1">
                Crafting modern web solutions with care.
              </p>
            </div>
          </div>

          {/* Nav links as pills - only render after hydration to prevent mismatch */}
          <nav className="flex flex-wrap gap-2 sm:gap-3 md:justify-center">
            {mounted && NAVIGATION_LINKS.map((item) => {
              const active = isActiveLink(pathname, item.href);
              
              return active ? (
                <MovingBorderButton
                  key={item.href}
                  as={Link}
                  href={item.href}
                  borderRadius="1.75rem"
                  className="min-h-[44px] min-w-[44px] transition-all duration-200 active:scale-95 px-4 py-2 text-sm sm:text-base font-medium shadow-lg active:shadow-md"
                  duration={4000}
                >
                  {item.label}
                </MovingBorderButton>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="min-h-[44px] min-w-[44px] transition-all duration-200 active:scale-[0.98] active:opacity-80 inline-flex items-center rounded-full border border-white/[0.1] dark:border-white/[0.05] px-4 py-2 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white/[0.08] dark:bg-black/[0.12] hover:bg-white/[0.15] dark:hover:bg-black/[0.2] shadow-lg active:shadow-md"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Socials */}
          <div className="flex justify-center md:justify-end gap-3 sm:gap-4">
            <IconButton
              href={SOCIAL_LINKS[0].href}
              label={SOCIAL_LINKS[0].label}
              icon={<Github size={20} />}
            />
            <IconButton
              href={SOCIAL_LINKS[1].href}
              label={SOCIAL_LINKS[1].label}
              icon={<Linkedin size={20} />}
            />
            <IconButton
              href={SOCIAL_LINKS[2].href}
              label={SOCIAL_LINKS[2].label}
              icon={<Mail size={20} />}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200/60 dark:border-gray-700/60" />

        {/* Secondary row with improved visibility */}
        <div className="py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 min-h-[80px]">
          {/* Tech badges */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3">
            <span className="text-xs sm:text-sm leading-relaxed text-gray-500 dark:text-gray-400 font-medium">
              Built with
            </span>
            {TECH_STACK.map((tech) => (
              <span
                key={tech}
                className="transition-all duration-200 active:scale-[0.98] active:opacity-80 rounded-full bg-gray-100 dark:bg-gray-800/70 px-3 py-1.5 text-xs sm:text-sm leading-relaxed font-medium text-gray-700 dark:text-gray-300 ring-1 ring-inset ring-gray-200/70 dark:ring-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700/90"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Links row with enhanced visibility */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center w-full sm:w-auto">
            {/* Open source link */}
            <p className="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300 font-medium">
              Open source on{" "}
              <Link
                href="https://github.com/gauravpatil/workspace"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all duration-200 active:scale-[0.98] active:opacity-80 font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 underline-offset-4 hover:underline p-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60"
              >
                GitHub
              </Link>
            </p>

            {/* Copyright with better contrast */}
            <p className="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300 font-medium whitespace-nowrap">
              © {year} Gaurav Patil. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/** Small glassy icon button for socials */
function IconButton({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="min-h-[44px] min-w-[44px] transition-all duration-200 active:scale-[0.98] active:opacity-80 group inline-flex h-12 w-12 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border border-white/[0.15] dark:border-white/[0.1] bg-white/[0.12] dark:bg-black/[0.15] backdrop-blur-sm shadow-lg active:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 hover:bg-white/[0.2] dark:hover:bg-black/[0.25] hover:scale-110"
    >
      <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
        {icon}
      </span>
      <span className="sr-only">{label}</span>
    </Link>
  );
}
