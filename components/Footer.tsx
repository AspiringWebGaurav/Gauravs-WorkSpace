"use client";

import Link from "next/link";
import { useSettings } from "./SettingsProvider";
import { cn } from "@/lib/utils";

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

const Footer = () => {
  const { settings } = useSettings();
  const year = new Date().getFullYear();
  const socialLinks = {
    github: settings?.social?.github || "#",
    linkedin: settings?.social?.linkedin || "#",
  };

  return (
    <footer className="w-full border-t border-white/5 bg-slate-950/70">
      {/* Mobile Layout: Stack vertically */}
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-4 px-4 py-6 text-sm text-slate-400 md:hidden">
        {/* Social Icons */}
        <div className="flex items-center gap-3">
          <Link
            href={socialLinks.github}
            className={cn(iconClass)}
            aria-label="GitHub"
          >
            <ExternalIcon type="github" />
          </Link>
          <Link
            href={socialLinks.linkedin}
            className={cn(iconClass)}
            aria-label="LinkedIn"
          >
            <ExternalIcon type="linkedin" />
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-center text-xs text-slate-500">
          &copy; {year} Gaurav Workspace
          <br />
          Made with love by{" "}
          <Link
            href="https://www.gauravpatil.online"
            target="_blank"
            rel="noreferrer"
            className="text-slate-200 underline-offset-4 hover:text-accent hover:underline"
          >
            Gaurav
          </Link>
        </p>

        {/* Links */}
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider text-slate-500">
          <span className="hover:text-slate-300 transition cursor-pointer">
            Resume
          </span>
          <span className="text-slate-700">|</span>
          <span className="hover:text-slate-300 transition cursor-pointer">
            Portfolio
          </span>
          <span className="text-slate-700">|</span>
          <span className="hover:text-slate-300 transition cursor-pointer">
            VibeCoding
          </span>
        </div>
      </div>

      {/* Desktop Layout: Three-column */}
      <div className="relative mx-auto hidden w-full max-w-7xl items-center px-4 py-6 text-sm text-slate-400 md:flex md:px-8">
        {/* Left: Social Icons - Far Left */}
        <div className="flex items-center gap-3 z-10">
          <Link
            href={socialLinks.github}
            className={cn(iconClass)}
            aria-label="GitHub"
          >
            <ExternalIcon type="github" />
          </Link>
          <Link
            href={socialLinks.linkedin}
            className={cn(iconClass)}
            aria-label="LinkedIn"
          >
            <ExternalIcon type="linkedin" />
          </Link>
        </div>

        {/* Center: Copyright - Absolute Center */}
        <p className="absolute left-1/2 -translate-x-1/2 text-center text-xs text-slate-500 md:text-sm whitespace-nowrap">
          &copy; {year} Gaurav Workspace - Made with love by{" "}
          <Link
            href="https://www.gauravpatil.online"
            target="_blank"
            rel="noreferrer"
            className="text-slate-200 underline-offset-4 hover:text-accent hover:underline"
          >
            Gaurav
          </Link>
        </p>

        {/* Right: Links - Far Right */}
        <div className="ml-auto flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-slate-500 z-10">
          <span className="hover:text-slate-300 transition cursor-pointer">
            Resume
          </span>
          <span className="hover:text-slate-300 transition cursor-pointer">
            Portfolio
          </span>
          <span className="hover:text-slate-300 transition cursor-pointer">
            VibeCoding
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
