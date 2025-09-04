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
    <footer className="relative w-full bg-white/[0.02] dark:bg-black/[0.08] backdrop-blur-sm border-t border-white/[0.15] dark:border-white/[0.08]">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Primary row */}
        <div className="py-10 grid gap-8 md:grid-cols-3 items-center">
          {/* Brand / tagline */}
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white font-semibold shadow-sm">
              GW
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Gaurav&rsquo;s Workspace
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Crafting modern web solutions with care.
              </p>
            </div>
          </div>

          {/* Nav links as pills - only render after hydration to prevent mismatch */}
          <nav className="flex flex-wrap gap-2 md:justify-center">
            {mounted && NAVIGATION_LINKS.map((item) => {
              const active = isActiveLink(pathname, item.href);
              
              return active ? (
                <MovingBorderButton
                  key={item.href}
                  as={Link}
                  href={item.href}
                  borderRadius="1.5rem"
                  className="px-3 py-1.5 text-sm"
                  duration={4000}
                >
                  {item.label}
                </MovingBorderButton>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center rounded-full border border-white/[0.1] dark:border-white/[0.05] px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors bg-white/[0.08] dark:bg-black/[0.12] hover:bg-white/[0.15] dark:hover:bg-black/[0.2]"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Socials */}
          <div className="flex md:justify-end gap-3">
            <IconButton
              href={SOCIAL_LINKS[0].href}
              label={SOCIAL_LINKS[0].label}
              icon={<Github size={18} />}
            />
            <IconButton
              href={SOCIAL_LINKS[1].href}
              label={SOCIAL_LINKS[1].label}
              icon={<Linkedin size={18} />}
            />
            <IconButton
              href={SOCIAL_LINKS[2].href}
              label={SOCIAL_LINKS[2].label}
              icon={<Mail size={18} />}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200/60 dark:border-gray-700/60" />

        {/* Secondary row */}
        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Tech badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Built with
            </span>
            {TECH_STACK.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-gray-100 dark:bg-gray-800/70 px-2.5 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 ring-1 ring-inset ring-gray-200/70 dark:ring-gray-700"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Open source link */}
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Open source on{" "}
            <Link
              href="https://github.com/gauravpatil/workspace"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 underline-offset-4 hover:underline"
            >
              GitHub
            </Link>
          </p>

          {/* Copyright */}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © {year} Gaurav Patil. All rights reserved.
          </p>
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
      className="group inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.15] dark:border-white/[0.1] bg-white/[0.12] dark:bg-black/[0.15] backdrop-blur-sm shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 hover:bg-white/[0.2] dark:hover:bg-black/[0.25]"
    >
      <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
        {icon}
      </span>
      <span className="sr-only">{label}</span>
    </Link>
  );
}
