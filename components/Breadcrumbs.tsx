'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const labelMap: Record<string, string> = {
  admin: "Admin",
  dashboard: "Dashboard",
  vibecoding: "VibeCoding",
};

const Breadcrumbs = () => {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const segments = parts.map((segment, index) => {
    const href = `/${parts.slice(0, index + 1).join("/")}`;
    const pretty = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return {
      href,
      label: labelMap[segment] ?? pretty,
    };
  });

  if (segments.length === 0) {
    segments.push({ href: "/", label: "Home" });
  } else {
    segments.unshift({ href: "/", label: "Home" });
  }

  const condensed = segments[segments.length - 1];

  return (
    <div className="border-b border-white/5 bg-slate-950/60 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-2 px-4 py-3 text-xs font-medium uppercase tracking-[0.28em] text-slate-400 md:px-8">
        <div className="md:hidden">
          <span className="rounded-full bg-white/5 px-3 py-1 text-slate-100">
            {condensed.label}
          </span>
        </div>
        <nav
          aria-label="Breadcrumb"
          className="hidden items-center gap-2 truncate md:flex"
        >
          {segments.map((segment, index) => {
            const isLast = index === segments.length - 1;
            return (
              <div
                key={`${segment.href}-${segment.label}`}
                className="flex items-center gap-2"
              >
                {index > 0 ? (
                  <span className="text-slate-600" aria-hidden="true">
                    /
                  </span>
                ) : null}
                {isLast ? (
                  <span className="rounded-full bg-white/5 px-3 py-1 text-slate-100">
                    {segment.label}
                  </span>
                ) : (
                  <Link
                    href={segment.href}
                    className={cn(
                      "rounded-full px-3 py-1 text-slate-400 transition hover:bg-white/10 hover:text-slate-100"
                    )}
                  >
                    {segment.label}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumbs;
