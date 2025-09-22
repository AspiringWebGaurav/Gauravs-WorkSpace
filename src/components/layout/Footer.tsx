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
    <footer className="relative w-full" style={{
      minHeight: 'clamp(8rem, 12vh, 12rem)'
    }}>
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 h-full flex flex-col justify-center">
        {/* Primary row */}
        <div className="grid gap-4 md:gap-6 md:grid-cols-3 items-center" style={{
          padding: 'clamp(1rem, 3vh, 2rem) 0'
        }}>
          {/* Brand / tagline */}
          <div className="flex items-center gap-3 transition-all duration-200 active:scale-[0.98] active:opacity-80 p-2 rounded-xl hover:bg-white/5 dark:hover:bg-black/5">
            <div className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 text-white font-semibold shadow-sm min-h-[44px] min-w-[44px]" style={{
              width: 'clamp(2.5rem, 4vh, 3rem)',
              height: 'clamp(2.5rem, 4vh, 3rem)'
            }}>
              GW
            </div>
            <div>
              <p className="leading-tight font-medium text-gray-900 dark:text-gray-100" style={{
                fontSize: 'clamp(1.125rem, 2.5vh, 1.5rem)'
              }}>
                Gaurav&rsquo;s Workspace
              </p>
              <p className="leading-relaxed text-gray-500 dark:text-gray-400 mt-1" style={{
                fontSize: 'clamp(0.75rem, 1.5vh, 0.875rem)'
              }}>
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
                  borderRadius="1.75rem"
                  className="min-h-[44px] min-w-[44px] transition-all duration-200 active:scale-95 font-medium shadow-lg active:shadow-md"
                  style={{
                    padding: 'clamp(0.5rem, 1vh, 0.75rem) clamp(1rem, 2vh, 1.5rem)',
                    fontSize: 'clamp(0.875rem, 1.5vh, 1rem)'
                  }}
                  duration={4000}
                >
                  {item.label}
                </MovingBorderButton>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="min-h-[44px] min-w-[44px] transition-all duration-200 active:scale-[0.98] active:opacity-80 inline-flex items-center rounded-full border border-white/[0.1] dark:border-white/[0.05] font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white/[0.08] dark:bg-black/[0.12] hover:bg-white/[0.15] dark:hover:bg-black/[0.2] shadow-lg active:shadow-md"
                  style={{
                    padding: 'clamp(0.5rem, 1vh, 0.75rem) clamp(1rem, 2vh, 1.5rem)',
                    fontSize: 'clamp(0.875rem, 1.5vh, 1rem)'
                  }}
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
      className="min-h-[44px] min-w-[44px] transition-all duration-200 active:scale-[0.98] active:opacity-80 group inline-flex items-center justify-center rounded-2xl border border-white/[0.15] dark:border-white/[0.1] bg-white/[0.12] dark:bg-black/[0.15] backdrop-blur-sm shadow-lg active:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 hover:bg-white/[0.2] dark:hover:bg-black/[0.25] hover:scale-110"
      style={{
        width: 'clamp(2.75rem, 4vh, 3rem)',
        height: 'clamp(2.75rem, 4vh, 3rem)'
      }}
    >
      <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
        {icon}
      </span>
      <span className="sr-only">{label}</span>
    </Link>
  );
}
