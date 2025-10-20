"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import Card, {
  CardActions,
  CardBadge,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/Card";
import Button, { buttonClasses } from "@/components/Button";
import ReachOutModal from "@/components/ReachOutModal";
import ResumeDownloadModal from "@/components/ResumeDownloadModal";
import { usePrefetchResume } from "@/hooks/usePrefetchResume";
import { fetchProjectBySlug, type ProjectDoc } from "@/lib/firestore";
import { useToast } from "@/components/Toast";
import { formatDate } from "@/lib/utils";

const portfolioUrl =
  process.env.NEXT_PUBLIC_PORTFOLIO_URL ?? "https://www.gauravpatil.online";

export default function HomePage() {
  const { resumeUrl, isLoading: isResumeLoading } = usePrefetchResume();
  const { pushToast } = useToast();
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [isResumeModalOpen, setResumeModalOpen] = React.useState(false);
  const [vibeCoding, setVibeCoding] = React.useState<ProjectDoc | null>(null);
  const [isProjectLoading, setProjectLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    const loadProject = async () => {
      setProjectLoading(true);
      try {
        const project = await fetchProjectBySlug("vibecoding");
        if (isMounted) {
          setVibeCoding(project);
        }
      } finally {
        if (isMounted) {
          setProjectLoading(false);
        }
      }
    };
    void loadProject();
    return () => {
      isMounted = false;
    };
  }, []);

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
          <Card className="relative overflow-hidden">
            <CardHeader className="items-start">
              <div className="flex flex-col gap-2">
                <CardBadge>BETA</CardBadge>
                <CardTitle>VibeCoding (Beta)</CardTitle>
                <CardDescription>
                  Experimenting with collaborative coding prompts and real-time
                  feedback loops.
                </CardDescription>
              </div>
            </CardHeader>
            <div className="relative mt-4 h-40 w-full overflow-hidden rounded-xl border border-white/10 bg-surface-subtle">
              {vibeCoding?.imageUrl ? (
                <Image
                  src={vibeCoding.imageUrl}
                  alt={vibeCoding.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 280px, 100vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand/20 to-accent/20 text-sm text-slate-200">
                  {isProjectLoading ? "Loading preview" : "Visual coming soon."}
                </div>
              )}
            </div>
            <CardActions className="justify-between">
              <span className="text-xs text-slate-500">
                Last updated:{" "}
                {vibeCoding?.updatedAt
                  ? formatDate(vibeCoding.updatedAt.toDate())
                  : ""}
              </span>
              <a
                href="/vibecoding"
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses("primary", "sm")}
              >
                View
              </a>
            </CardActions>
          </Card>
        </div>
      </section>

      {/* Desktop View - Non-Scrollable Full Screen with Navbar & Footer */}
      <section className="desktop-fullscreen fixed inset-0 z-10 hidden lg:flex flex-col w-full overflow-hidden bg-slate-950">
        {/* Integrated Navbar for Desktop */}
        <nav className="border-b border-white/5 bg-slate-950/90 backdrop-blur-xl">
          <div className="relative mx-auto flex w-full max-w-7xl items-center px-8 py-3">
            {/* Left: Logo - Far Left */}
            <Link href="/" className="flex items-center gap-3 mr-auto">
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

            {/* Center: Navigation - Absolute Center */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6 text-xs font-medium text-slate-300">
              <Link
                href="/"
                className="rounded-full bg-brand/20 px-3 py-1.5 text-slate-50"
              >
                Home
              </Link>
              <Link
                href="/vibecoding"
                className="rounded-full px-3 py-1.5 transition hover:text-slate-50"
              >
                VibeCoding
              </Link>
              <Link
                href="/admin"
                className="rounded-full px-3 py-1.5 transition hover:text-slate-50"
              >
                Admin
              </Link>
            </div>

            {/* Right: Social Icons - Far Right */}
            <div className="flex items-center gap-2 ml-auto">
              <Link
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:border-brand/70 hover:text-accent"
                aria-label="GitHub"
              >
                <svg
                  className="h-4 w-4"
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
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:border-brand/70 hover:text-accent"
                aria-label="LinkedIn"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.352V9.5h3.414v1.496h.047c.476-.9 1.637-1.852 3.368-1.852 3.602 0 4.268 2.37 4.268 5.455v5.853ZM5.337 8.003a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124Zm1.782 12.449H3.555V9.5h3.564v10.952Z" />
                </svg>
              </Link>
            </div>
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

          {/* Right Panel - Action Cards Grid */}
          <div className="flex w-1/2 items-center justify-center p-6">
            <div className="grid h-full max-h-[520px] w-full max-w-2xl grid-cols-2 grid-rows-2 gap-3">
              {/* Resume Card */}
              <Card className="group relative flex flex-col overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-brand/20">
                <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <CardHeader className="pb-1.5">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <div className="rounded-lg bg-brand/20 p-1">
                        <svg
                          className="h-3.5 w-3.5 text-brand"
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
                      <CardTitle className="text-sm">Resume</CardTitle>
                    </div>
                    <CardDescription className="text-[11px] leading-snug">
                      Latest PDF. No forms, no friction.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardActions className="mt-auto flex-col items-stretch gap-1 pt-0">
                  <button
                    type="button"
                    onClick={handleResumeClick}
                    disabled={isResumeLoading || !resumeUrl}
                    className={`${buttonClasses(resumeUrl ? "primary" : "secondary", "sm")} !h-7 w-full justify-center text-[10px] font-medium`}
                  >
                    <svg
                      className="mr-1 h-2.5 w-2.5"
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
                  <span className="text-[9px] text-center text-slate-500">
                    Prefetched for instant access
                  </span>
                </CardActions>
              </Card>

              {/* Portfolio Card */}
              <Card className="group relative flex flex-col overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-accent/20">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <CardHeader className="pb-1.5">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <div className="rounded-lg bg-accent/20 p-1">
                        <svg
                          className="h-3.5 w-3.5 text-accent"
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
                      <CardTitle className="text-sm">Portfolio</CardTitle>
                    </div>
                    <CardDescription className="text-[11px] leading-snug">
                      Rich case studies and context.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardActions className="mt-auto flex-col items-stretch gap-1 pt-0">
                  <a
                    href={portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${buttonClasses("secondary", "sm")} !h-7 w-full justify-center text-[10px] font-medium`}
                  >
                    <svg
                      className="mr-1 h-2.5 w-2.5"
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
                  <span className="text-[9px] text-center text-slate-500">
                    Opens in a new tab
                  </span>
                </CardActions>
              </Card>

              {/* Contact Card */}
              <Card className="group relative flex flex-col overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-success/20">
                <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <CardHeader className="pb-1.5">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <div className="rounded-lg bg-success/20 p-1">
                        <svg
                          className="h-3.5 w-3.5 text-success"
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
                      <CardTitle className="text-sm">Contact</CardTitle>
                    </div>
                    <CardDescription className="text-[11px] leading-snug">
                      Get a fast reply within 24 hours.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardActions className="mt-auto flex-col items-stretch gap-1 pt-0">
                  <button
                    type="button"
                    onClick={handleReachOut}
                    className={`${buttonClasses("primary", "sm")} !h-7 w-full justify-center text-[10px] font-medium`}
                  >
                    <svg
                      className="mr-1 h-2.5 w-2.5"
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
                  <span className="text-[9px] text-center text-slate-500">
                    Response within 24 hours
                  </span>
                </CardActions>
              </Card>

              {/* VibeCoding Card - Spans 2 columns */}
              <Card className="group relative col-span-2 flex flex-col overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-purple-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="flex h-full gap-3">
                  <div className="flex flex-1 flex-col justify-between">
                    <CardHeader className="items-start pb-1.5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CardBadge>BETA</CardBadge>
                          <div className="flex items-center gap-1 text-[9px] text-slate-500">
                            <svg
                              className="h-2.5 w-2.5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {vibeCoding?.updatedAt
                              ? formatDate(vibeCoding.updatedAt.toDate())
                              : "Recently updated"}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="rounded-lg bg-purple-500/20 p-1">
                            <svg
                              className="h-3.5 w-3.5 text-purple-400"
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
                          </div>
                          <CardTitle className="text-sm">VibeCoding</CardTitle>
                        </div>
                        <CardDescription className="text-[11px] leading-snug">
                          Experimenting with collaborative coding prompts and
                          real-time feedback loops.
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardActions className="pt-0">
                      <a
                        href="/vibecoding"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${buttonClasses("primary", "sm")} group/btn !h-7 text-[10px] font-medium px-3`}
                      >
                        Explore Beta
                        <svg
                          className="ml-1 h-2.5 w-2.5 transition-transform group-hover/btn:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </a>
                    </CardActions>
                  </div>
                  <div className="relative h-full w-36 overflow-hidden rounded-lg border border-white/10 bg-surface-subtle">
                    {vibeCoding?.imageUrl ? (
                      <Image
                        src={vibeCoding.imageUrl}
                        alt={vibeCoding.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="144px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand/20 via-purple-500/20 to-accent/20 text-xs text-slate-200">
                        {isProjectLoading ? (
                          <div className="flex flex-col items-center gap-2">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-400 border-t-brand"></div>
                            <span className="text-[10px]">Loading...</span>
                          </div>
                        ) : (
                          "Preview"
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Integrated Footer for Desktop */}
        <footer className="border-t border-white/5 bg-slate-950/90 backdrop-blur-xl">
          <div className="relative mx-auto flex w-full max-w-7xl items-center px-8 py-3">
            {/* Left: Social Icons - Far Left */}
            <div className="flex items-center gap-2">
              <Link
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:border-brand/70 hover:text-accent"
                aria-label="GitHub"
              >
                <svg
                  className="h-4 w-4"
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
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:border-brand/70 hover:text-accent"
                aria-label="LinkedIn"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.352V9.5h3.414v1.496h.047c.476-.9 1.637-1.852 3.368-1.852 3.602 0 4.268 2.37 4.268 5.455v5.853ZM5.337 8.003a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124Zm1.782 12.449H3.555V9.5h3.564v10.952Z" />
                </svg>
              </Link>
            </div>

            {/* Center: Copyright - Absolute Center */}
            <p className="absolute left-1/2 -translate-x-1/2 text-[10px] text-slate-500 whitespace-nowrap">
              © 2025 Gaurav Workspace - Made with love by{" "}
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
            <div className="ml-auto flex items-center gap-3 text-[9px] uppercase tracking-wider">
              <button
                type="button"
                onClick={handleResumeClick}
                className="text-slate-500 hover:text-slate-300 transition cursor-pointer"
              >
                Resume
              </button>
              <Link
                href={portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="text-slate-500 hover:text-slate-300 transition"
              >
                Portfolio
              </Link>
              <Link
                href="/vibecoding"
                className="text-slate-500 hover:text-slate-300 transition"
              >
                VibeCoding
              </Link>
            </div>
          </div>
        </footer>
      </section>
    </>
  );
}
