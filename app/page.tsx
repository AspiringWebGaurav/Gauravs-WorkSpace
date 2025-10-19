'use client';

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

  return (
    <>
      <ReachOutModal open={isModalOpen} onClose={() => setModalOpen(false)} />
      <section className="mx-auto flex min-h-[calc(100vh-220px)] w-full max-w-6xl flex-col justify-center gap-8 px-4 py-8 md:gap-12 md:px-8 md:py-12 lg:py-16">
        <div className="flex flex-col gap-4 text-left md:max-w-3xl">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-brand-foreground">
            HR Ready - Instant Context
          </span>
          <h1 className="text-4xl font-semibold text-slate-100 md:text-5xl">
            Gaurav Workspace
          </h1>
          <p className="text-base text-slate-300 md:text-lg">
            Lightning-fast snapshot of who I am, what I build, and how to hire me.
            Download the latest resume instantly, scan the essentials, or find the
            deeper portfolio when you have a minute.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Card className="justify-between">
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
              {resumeUrl ? (
                <a
                  href={resumeUrl}
                  download
                  className={buttonClasses("primary", "sm")}
                >
                  Download
                </a>
              ) : (
                <button
                  type="button"
                  onClick={handleResumeMissing}
                  className={buttonClasses("secondary", "sm")}
                  disabled={isResumeLoading}
                >
                  {isResumeLoading ? "Preparing" : "Unavailable"}
                </button>
              )}
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
              <Link
                href={portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className={buttonClasses("secondary", "sm")}
              >
                Visit portfolio
              </Link>
            </CardActions>
          </Card>
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Reach out to me</CardTitle>
                <CardDescription>
                  Share the role, compensation, and next steps to get a fast reply.
                </CardDescription>
              </div>
            </CardHeader>
            <CardActions className="justify-between">
              <span className="text-xs text-slate-500">
                Response within 24 hours.
              </span>
              <Button variant="primary" size="sm" onClick={handleReachOut}>
                Compose message
              </Button>
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
                  {isProjectLoading
                    ? "Loading preview"
                    : "Visual coming soon."}
                </div>
              )}
            </div>
            <CardActions className="justify-between">
              <span className="text-xs text-slate-500">
                Last updated:{" "}
                {vibeCoding?.updatedAt
                  ? formatDate(vibeCoding.updatedAt.toDate())
                  : "”"}
              </span>
              <Link href="/vibecoding" className={buttonClasses("primary", "sm")}>
                View
              </Link>
            </CardActions>
          </Card>
        </div>
      </section>
    </>
  );
}









