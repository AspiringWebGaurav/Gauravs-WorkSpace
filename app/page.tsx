"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import Card, {
  CardActions,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/Card";
import Button, { buttonClasses } from "@/components/Button";
import ReachOutModal from "@/components/ReachOutModal";
import ResumeDownloadModal from "@/components/ResumeDownloadModal";
import { usePrefetchResume } from "@/hooks/usePrefetchResume";
import { useToast } from "@/components/Toast";

const portfolioUrl =
  process.env.NEXT_PUBLIC_PORTFOLIO_URL ?? "https://www.gauravpatil.online";

export default function HomePage() {
  const { resumeUrl, isLoading: isResumeLoading } = usePrefetchResume();
  const { pushToast } = useToast();
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [isResumeModalOpen, setResumeModalOpen] = React.useState(false);

  const handleResumeMissing = React.useCallback(() => {
    pushToast({
      title: "Resume not linked yet.",
      description: "Check back shortly or reach out directly for a copy.",
      intent: "info",
    });
  }, [pushToast]);

  const handleReachOut = React.useCallback(() => {
    setModalOpen(true);
  }, []);

  const handleResumeClick = React.useCallback(() => {
    if (resumeUrl) {
      setResumeModalOpen(true);
    } else {
      handleResumeMissing();
    }
  }, [resumeUrl, handleResumeMissing]);

  return (
    <>
      <ReachOutModal open={isModalOpen} onClose={() => setModalOpen(false)} />
      {resumeUrl && (
        <ResumeDownloadModal
          open={isResumeModalOpen}
          onClose={() => setResumeModalOpen(false)}
          resumeUrl={resumeUrl}
        />
      )}

      {/* Mobile & Tablet View - Scrollable */}
      <section className="mx-auto flex min-h-[calc(100vh-220px)] w-full max-w-6xl flex-col justify-center gap-8 px-4 py-8 md:gap-12 md:px-8 md:py-12 lg:hidden overflow-x-hidden">
        <div className="flex flex-col gap-4 text-left md:max-w-3xl w-full">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-brand-foreground">
            HR Ready - Instant Context
          </span>
          <h1 className="text-4xl font-semibold text-slate-100 md:text-5xl">
            Gaurav Workspace
          </h1>
          <p className="text-base text-slate-300 md:text-lg">
            Lightning-fast snapshot of who I am, what I build, and how to hire
            me. Download the latest resume instantly, scan the essentials, or
            find the deeper portfolio when you have a minute.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 w-full">
          <Card className="justify-between w-full">
            <CardHeader>
              <div>
                <CardTitle>Download Resume</CardTitle>
                <CardDescription>
                  Always the latest PDF. No forms, no friction.
                </CardDescription>
              </div>
            </CardHeader>
            <CardActions className="justify-between">
              <span className="text-xs text-slate-500">
                Prefetched for instant access.
              </span>
              <button
                type="button"
                onClick={handleResumeClick}
                className={buttonClasses(
                  resumeUrl ? "primary" : "secondary",
                  "sm"
                )}
                disabled={isResumeLoading}
              >
                {isResumeLoading
                  ? "Preparing"
                  : resumeUrl
                    ? "Download"
                    : "Unavailable"}
              </button>
            </CardActions>
          </Card>
          <Card>
            <CardHeader>
              <div>
                <CardTitle>My Portfolio</CardTitle>
                <CardDescription>
                  For product depth, rich case studies, and context.
                </CardDescription>
              </div>
            </CardHeader>
            <CardActions className="justify-between">
              <span className="text-xs text-slate-500">
                Opens in a new tab.
              </span>
              <a
                href={portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses("secondary", "sm")}
              >
                Visit portfolio
              </a>
            </CardActions>
          </Card>
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Reach out to me</CardTitle>
                <CardDescription>
                  Share the role, compensation, and next steps to get a fast
                  reply.
                </CardDescription>
              </div>
            </CardHeader>
            <CardActions className="justify-between">
              <span className="text-xs text-slate-500">
                Response within 24 hours.
              </span>
              <button
                type="button"
                onClick={handleReachOut}
                className={buttonClasses("primary", "sm")}
              >
                Compose message
              </button>
            </CardActions>
          </Card>
        </div>
      </section>

      {/* Desktop View - Non-Scrollable Full Screen with Navbar & Footer */}
      <section className="desktop-fullscreen fixed inset-0 z-10 hidden lg:flex flex-col w-full overflow-hidden bg-slate-950">
        {/* Integrated Navbar for Desktop */}
        <nav className="relative border-b border-white/10 bg-slate-950/95 backdrop-blur-xl">
          <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-8 py-3.5">
            {/* Left: Logo & Social Icons */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/logo.svg"
                  alt="Gaurav Workspace"
                  width={32}
                  height={32}
                  priority
                />
                <span className="text-base font-semibold text-slate-100">
                  Gaurav Workspace
                </span>
              </Link>
              <span className="h-5 w-px bg-white/10" />
              <div className="flex items-center gap-2">
                <Link
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition-all duration-300 hover:border-brand/50 hover:bg-brand/10 hover:text-brand hover:scale-110"
                  aria-label="GitHub"
                >
                  <svg
                    className="h-4 w-4 transition-transform group-hover:scale-110"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.486 2 12.021c0 4.411 2.865 8.145 6.839 9.465.5.093.683-.219.683-.486 0-.239-.009-.868-.014-1.703-2.782.606-3.369-1.342-3.369-1.342-.455-1.159-1.11-1.468-1.11-1.468-.908-.621.069-.609.069-.609 1.003.071 1.531 1.032 1.531 1.032.892 1.533 2.341 1.09 2.91.834.091-.648.35-1.09.636-1.341-2.221-.256-4.555-1.114-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.257-.447-1.288.098-2.684 0 0 .84-.27 2.75 1.026A9.56 9.56 0 0 1 12 6.844c.851.004 1.705.115 2.503.338 1.908-1.297 2.747-1.026 2.747-1.026.547 1.396.203 2.427.1 2.684.642.7 1.028 1.595 1.028 2.688 0 3.847-2.338 4.692-4.566 4.943.36.312.68.927.68 1.87 0 1.35-.012 2.439-.012 2.771 0 .27.18.584.688.485A10.024 10.024 0 0 0 22 12.02C22 6.486 17.523 2 12 2Z"
                    />
                  </svg>
                </Link>
                <Link
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition-all duration-300 hover:border-accent/50 hover:bg-accent/10 hover:text-accent hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="h-4 w-4 transition-transform group-hover:scale-110"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.352V9.5h3.414v1.496h.047c.476-.9 1.637-1.852 3.368-1.852 3.602 0 4.268 2.37 4.268 5.455v5.853ZM5.337 8.003a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124Zm1.782 12.449H3.555V9.5h3.564v10.952Z" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Center: Navigation - Absolute Center */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
              <Link
                href="/"
                className="rounded-lg bg-white/10 px-4 py-2 text-xs font-medium text-slate-200 transition-all hover:bg-white/15"
              >
                Home
              </Link>
              <Link
                href="/vibecoding"
                className="group relative rounded-lg px-4 py-2 text-xs font-medium text-slate-400 transition-all hover:text-slate-200"
              >
                VibeCoding
                <span className="ml-1.5 rounded-md bg-purple-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-purple-300 ring-1 ring-purple-400/30">
                  Beta
                </span>
              </Link>
              <Link
                href="/admin"
                className="rounded-lg px-4 py-2 text-xs font-medium text-slate-400 transition-all hover:text-slate-200"
              >
                Admin
              </Link>
            </div>

            {/* Right: Empty for balance */}
            <div className="w-[180px]" />
          </div>
        </nav>

        {/* Main Content Area */}
        <div className="relative flex flex-1 w-full overflow-hidden">
          {/* Left Panel - Hero Section */}
          <div className="flex w-1/2 items-center justify-center border-r border-white/5 bg-gradient-to-br from-slate-950 via-slate-900/80 to-slate-950 p-6">
            <div className="relative max-w-xl space-y-6">
              {/* Animated Background Elements */}
              <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-brand/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

              <div className="relative space-y-5 animate-fade-in">
                <div className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-brand-foreground backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-brand"></span>
                  </span>
                  HR Ready - Instant Context
                </div>

                <div className="space-y-4">
                  <h1 className="text-6xl font-bold leading-tight text-slate-100">
                    Gaurav
                    <span className="block bg-gradient-to-r from-brand via-accent to-brand bg-clip-text text-transparent">
                      Workspace
                    </span>
                  </h1>
                  <div className="h-1 w-24 rounded-full bg-gradient-to-r from-brand to-accent" />
                </div>

                <p className="text-lg leading-relaxed text-slate-300">
                  Lightning-fast snapshot of who I am, what I build, and how to
                  hire me.
                  <span className="mt-2 block text-base text-slate-400">
                    Download the latest resume instantly, scan the essentials,
                    or explore the deeper portfolio.
                  </span>
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 pt-6">
                  <button
                    type="button"
                    onClick={handleResumeClick}
                    disabled={!resumeUrl}
                    className="space-y-1 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:border-brand/40 hover:bg-brand/10 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="text-2xl font-bold text-brand">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div className="text-xs font-medium text-slate-400">
                      Resume Ready
                    </div>
                  </button>
                  <div className="space-y-1 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <div className="text-2xl font-bold text-accent">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <div className="text-xs font-medium text-slate-400">
                      Instant Access
                    </div>
                  </div>
                  <div className="space-y-1 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <div className="text-2xl font-bold text-success">24h</div>
                    <div className="text-xs font-medium text-slate-400">
                      Response Time
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Action Cards - Vertical Stack with Horizontal Content */}
          <div className="flex w-1/2 items-center justify-center px-12 py-12">
            <div className="flex h-full w-full max-w-5xl flex-col justify-center gap-6">
              {/* Resume Card */}
              <div
                className="group relative flex flex-1 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl transition-all duration-300 hover:scale-[1.01] hover:border-brand/30 hover:shadow-2xl hover:shadow-brand/30 animate-fade-in"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-brand/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand/5 blur-3xl transition-all duration-500 group-hover:scale-150" />

                <div className="relative z-10 flex w-full items-center justify-between gap-8 px-10 py-8">
                  {/* Icon - Left */}
                  <div className="flex-shrink-0">
                    <div className="rounded-2xl bg-gradient-to-br from-brand/30 to-brand/10 p-4 ring-2 ring-brand/20 backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:ring-brand/40 group-hover:shadow-xl group-hover:shadow-brand/20">
                      <svg
                        className="h-8 w-8 text-brand drop-shadow-lg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Content - Center */}
                  <div className="flex-1 min-w-0 px-4">
                    <h3 className="text-2xl font-bold text-slate-50 transition-colors group-hover:text-brand">
                      Resume
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      Latest PDF. No forms, no friction.
                    </p>
                  </div>

                  {/* Button - Right */}
                  <button
                    type="button"
                    onClick={handleResumeClick}
                    disabled={isResumeLoading || !resumeUrl}
                    className="group/btn relative flex-shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-brand w-[180px] h-[52px] text-sm font-semibold text-white shadow-lg shadow-brand/30 transition-all duration-300 hover:bg-brand/90 hover:shadow-xl hover:shadow-brand/40 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <svg
                      className="h-4 w-4 transition-transform group-hover/btn:scale-110"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    {isResumeLoading
                      ? "Preparing..."
                      : resumeUrl
                        ? "Download PDF"
                        : "Unavailable"}
                  </button>
                </div>
              </div>

              {/* Portfolio Card */}
              <div
                className="group relative flex flex-1 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl transition-all duration-300 hover:scale-[1.01] hover:border-accent/30 hover:shadow-2xl hover:shadow-accent/30 animate-fade-in"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent/5 blur-3xl transition-all duration-500 group-hover:scale-150" />

                <div className="relative z-10 flex w-full items-center justify-between gap-8 px-10 py-8">
                  {/* Icon - Left */}
                  <div className="flex-shrink-0">
                    <div className="rounded-2xl bg-gradient-to-br from-accent/30 to-accent/10 p-4 ring-2 ring-accent/20 backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:ring-accent/40 group-hover:shadow-xl group-hover:shadow-accent/20">
                      <svg
                        className="h-8 w-8 text-accent drop-shadow-lg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Content - Center */}
                  <div className="flex-1 min-w-0 px-4">
                    <h3 className="text-2xl font-bold text-slate-50 transition-colors group-hover:text-accent">
                      Portfolio
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      Rich case studies and context.
                    </p>
                  </div>

                  {/* Button - Right */}
                  <a
                    href={portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn relative flex-shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-accent w-[180px] h-[52px] text-sm font-semibold text-white shadow-lg shadow-accent/30 transition-all duration-300 hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/40 hover:scale-105"
                  >
                    <svg
                      className="h-4 w-4 transition-transform group-hover/btn:scale-110"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    Visit Portfolio
                  </a>
                </div>
              </div>

              {/* Contact Card */}
              <div
                className="group relative flex flex-1 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl transition-all duration-300 hover:scale-[1.01] hover:border-success/30 hover:shadow-2xl hover:shadow-success/30 animate-fade-in"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-success/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-success/5 blur-3xl transition-all duration-500 group-hover:scale-150" />

                <div className="relative z-10 flex w-full items-center justify-between gap-8 px-10 py-8">
                  {/* Icon - Left */}
                  <div className="flex-shrink-0">
                    <div className="rounded-2xl bg-gradient-to-br from-success/30 to-success/10 p-4 ring-2 ring-success/20 backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:ring-success/40 group-hover:shadow-xl group-hover:shadow-success/20">
                      <svg
                        className="h-8 w-8 text-success drop-shadow-lg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Content - Center */}
                  <div className="flex-1 min-w-0 px-4">
                    <h3 className="text-2xl font-bold text-slate-50 transition-colors group-hover:text-success">
                      Contact
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      Ask me anything. Replies within 24 hours.
                    </p>
                  </div>

                  {/* Button - Right */}
                  <button
                    type="button"
                    onClick={handleReachOut}
                    className="group/btn relative flex-shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-success w-[180px] h-[52px] text-sm font-semibold text-white shadow-lg shadow-success/30 transition-all duration-300 hover:bg-success/90 hover:shadow-xl hover:shadow-success/40 hover:scale-105"
                  >
                    <svg
                      className="h-4 w-4 transition-transform group-hover/btn:scale-110"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    Compose Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Integrated Footer for Desktop */}
        <footer className="relative border-t border-white/10 bg-slate-950/95 backdrop-blur-xl">
          <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-8 py-3.5">
            {/* Left: Social Icons */}
            <div className="flex items-center gap-3">
              <Link
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition-all duration-300 hover:border-brand/50 hover:bg-brand/10 hover:text-brand hover:scale-110"
                aria-label="GitHub"
              >
                <svg
                  className="h-4 w-4 transition-transform group-hover:scale-110"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.486 2 12.021c0 4.411 2.865 8.145 6.839 9.465.5.093.683-.219.683-.486 0-.239-.009-.868-.014-1.703-2.782.606-3.369-1.342-3.369-1.342-.455-1.159-1.11-1.468-1.11-1.468-.908-.621.069-.609.069-.609 1.003.071 1.531 1.032 1.531 1.032.892 1.533 2.341 1.09 2.91.834.091-.648.35-1.09.636-1.341-2.221-.256-4.555-1.114-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.257-.447-1.288.098-2.684 0 0 .84-.27 2.75 1.026A9.56 9.56 0 0 1 12 6.844c.851.004 1.705.115 2.503.338 1.908-1.297 2.747-1.026 2.747-1.026.547 1.396.203 2.427.1 2.684.642.7 1.028 1.595 1.028 2.688 0 3.847-2.338 4.692-4.566 4.943.36.312.68.927.68 1.87 0 1.35-.012 2.439-.012 2.771 0 .27.18.584.688.485A10.024 10.024 0 0 0 22 12.02C22 6.486 17.523 2 12 2Z"
                  />
                </svg>
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition-all duration-300 hover:border-accent/50 hover:bg-accent/10 hover:text-accent hover:scale-110"
                aria-label="LinkedIn"
              >
                <svg
                  className="h-4 w-4 transition-transform group-hover:scale-110"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.352V9.5h3.414v1.496h.047c.476-.9 1.637-1.852 3.368-1.852 3.602 0 4.268 2.37 4.268 5.455v5.853ZM5.337 8.003a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124Zm1.782 12.449H3.555V9.5h3.564v10.952Z" />
                </svg>
              </Link>
              <span className="ml-2 h-4 w-px bg-white/10" />
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                Connect
              </span>
            </div>

            {/* Center: Copyright */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <p className="text-[10px] text-slate-500 whitespace-nowrap">
                © 2025 Gaurav Workspace · Made with{" "}
                <span className="text-red-400">❤</span> by{" "}
                <Link
                  href="https://www.gauravpatil.online"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-300 font-medium underline-offset-4 hover:text-accent hover:underline transition-colors"
                >
                  Gaurav
                </Link>
              </p>
            </div>

            {/* Right: Quick Links */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResumeClick}
                className="group flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-slate-500 transition-all hover:bg-white/5 hover:text-slate-300"
              >
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                Resume
              </button>
              <span className="h-3 w-px bg-white/10" />
              <Link
                href={portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-slate-500 transition-all hover:bg-white/5 hover:text-slate-300"
              >
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Portfolio
              </Link>
              <span className="h-3 w-px bg-white/10" />
              <Link
                href="/vibecoding"
                className="group flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-slate-500 transition-all hover:bg-white/5 hover:text-slate-300"
              >
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
                VibeCoding
              </Link>
            </div>
          </div>
        </footer>
      </section>
    </>
  );
}
