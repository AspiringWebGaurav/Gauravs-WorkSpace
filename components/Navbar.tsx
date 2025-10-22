"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import Button from "./Button";
import { useSettings } from "./SettingsProvider";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", isBeta: false },
  { href: "/vibecoding", label: "VibeCoding", isBeta: true },
  { href: "/admin", label: "Admin", isBeta: false },
];

const iconClass =
  "inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:border-brand/70 hover:text-accent";

const ExternalIcon = ({
  type,
  className,
}: {
  type: "github" | "linkedin";
  className?: string;
}) => {
  if (type === "github") {
    return (
      <svg
        className={className}
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C6.477 2 2 6.486 2 12.021c0 4.411 2.865 8.145 6.839 9.465.5.093.683-.219.683-.486 0-.239-.009-.868-.014-1.703-2.782.606-3.369-1.342-3.369-1.342-.455-1.159-1.11-1.468-1.11-1.468-.908-.621.069-.609.069-.609 1.003.071 1.531 1.032 1.531 1.032.892 1.533 2.341 1.09 2.91.834.091-.648.35-1.09.636-1.341-2.221-.256-4.555-1.114-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.257-.447-1.288.098-2.684 0 0 .84-.27 2.75 1.026A9.56 9.56 0 0 1 12 6.844c.851.004 1.705.115 2.503.338 1.908-1.297 2.747-1.026 2.747-1.026.547 1.396.203 2.427.1 2.684.642.7 1.028 1.595 1.028 2.688 0 3.847-2.338 4.692-4.566 4.943.36.312.68.927.68 1.87 0 1.35-.012 2.439-.012 2.771 0 .27.18.584.688.485A10.024 10.024 0 0 0 22 12.02C22 6.486 17.523 2 12 2Z"
          fill="currentColor"
        />
      </svg>
    );
  }
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.352V9.5h3.414v1.496h.047c.476-.9 1.637-1.852 3.368-1.852 3.602 0 4.268 2.37 4.268 5.455v5.853ZM5.337 8.003a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124Zm1.782 12.449H3.555V9.5h3.564v10.952Z"
        fill="currentColor"
      />
    </svg>
  );
};

const Navbar = () => {
  const pathname = usePathname();
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const socialLinks = {
    github: settings?.social?.github || "#",
    linkedin: settings?.social?.linkedin || "#",
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
      <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        {/* Left: Logo - Far Left */}
        <Link href="/" className="flex items-center gap-3 z-10">
          <Image
            src="/logo.svg"
            alt="Gaurav Workspace logo"
            width={40}
            height={40}
            priority
          />
          <span className="hidden text-lg font-semibold text-slate-100 sm:inline-flex">
            Gaurav Workspace
          </span>
        </Link>

        {/* Center: Navigation - Absolute Center (Desktop only) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300 absolute left-1/2 -translate-x-1/2 z-0">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === item.href
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-2 transition flex items-center gap-1.5",
                  isActive ? "bg-brand/20 text-slate-50" : "hover:text-slate-50"
                )}
              >
                {item.label}
                {item.isBeta && (
                  <span className="inline-flex items-center rounded-full bg-purple-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-purple-300 border border-purple-400/30">
                    Beta
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Middle: Social Icons (Mobile only) - Between Logo and Hamburger */}
        <div className="flex items-center gap-2 md:hidden z-10">
          <Link
            href={socialLinks.github}
            target={socialLinks.github === "#" ? "_self" : "_blank"}
            rel="noreferrer"
            className={iconClass}
            aria-label="GitHub"
          >
            <ExternalIcon type="github" />
          </Link>
          <Link
            href={socialLinks.linkedin}
            target={socialLinks.linkedin === "#" ? "_self" : "_blank"}
            rel="noreferrer"
            className={iconClass}
            aria-label="LinkedIn"
          >
            <ExternalIcon type="linkedin" />
          </Link>
        </div>

        {/* Right: Social Icons (Desktop only) - Far Right */}
        <div className="hidden items-center gap-2 md:flex z-10">
          <Link
            href={socialLinks.github}
            target={socialLinks.github === "#" ? "_self" : "_blank"}
            rel="noreferrer"
            className={iconClass}
            aria-label="GitHub"
          >
            <ExternalIcon type="github" />
          </Link>
          <Link
            href={socialLinks.linkedin}
            target={socialLinks.linkedin === "#" ? "_self" : "_blank"}
            rel="noreferrer"
            className={iconClass}
            aria-label="LinkedIn"
          >
            <ExternalIcon type="linkedin" />
          </Link>
        </div>

        {/* Hamburger Menu Button (Mobile only) */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className="sr-only">Toggle navigation</span>
          <svg
            className="h-5 w-5 text-slate-100"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {isOpen ? (
              <path d="M18 6 6 18M6 6l12 12" />
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </Button>
      </div>
      {/* Mobile menu: nav links only (social links removed from here) */}
      {isOpen ? (
        <div className="md:hidden">
          <nav className="space-y-1 bg-slate-950/95 px-4 py-4">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition",
                    isActive
                      ? "bg-brand/20 text-slate-50"
                      : "text-slate-300 hover:bg-white/5 hover:text-slate-50"
                  )}
                >
                  <span>{item.label}</span>
                  {item.isBeta && (
                    <span className="inline-flex items-center rounded-full bg-purple-500/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-300 border border-purple-400/30">
                      Beta
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;
