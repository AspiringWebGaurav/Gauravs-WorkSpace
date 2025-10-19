'use client';

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import Card, {
  CardActions,
  CardBadge,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/Card";
import { buttonClasses } from "@/components/Button";
import { fetchProjectBySlug, type ProjectDoc } from "@/lib/firestore";
import { formatDate } from "@/lib/utils";

const VibeCodingPage = () => {
  const [project, setProject] = React.useState<ProjectDoc | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    const loadProject = async () => {
      setIsLoading(true);
      try {
        const data = await fetchProjectBySlug("vibecoding");
        if (active) {
          setProject(data);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };
    void loadProject();
    return () => {
      active = false;
    };
  }, []);

  const isPublished = project?.published;

  return (
    <section className="mx-auto flex min-h-[calc(100vh-220px)] w-full max-w-5xl flex-col justify-center gap-8 px-4 py-10 md:px-8">
      <Card className="overflow-hidden p-8 md:p-10">
        <CardHeader className="flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3">
            <CardBadge>BETA</CardBadge>
            <CardTitle className="text-3xl md:text-4xl">
              VibeCoding (Beta)
            </CardTitle>
            <CardDescription className="max-w-2xl text-base text-slate-300">
              A living experiment to explore pair-programming vibes, async code
              reviews, and conversational product discovery in one place.
            </CardDescription>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-400">
            <p>Last updated</p>
            <p className="text-sm font-semibold text-slate-100">
              {project?.updatedAt
                ? formatDate(project.updatedAt.toDate())
                : "â€”"}
            </p>
          </div>
        </CardHeader>
        <div className="mt-6 grid gap-6 md:grid-cols-[1.5fr_1fr]">
          <div className="relative h-72 overflow-hidden rounded-2xl border border-white/10 bg-surface-subtle">
            {isLoading ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-300">
                Loading vibeâ€¦
              </div>
            ) : isPublished && project?.imageUrl ? (
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand/20 to-accent/20 text-base font-semibold text-slate-100">
                Updating soon.
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
              {isPublished ? (
                <>
                  <p className="font-semibold text-slate-100">
                    What&apos;s inside
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-300">
                    <li>Â· Real-time collaborative coding canvas</li>
                    <li>Â· Curated prompts that adapt as you explore</li>
                    <li>Â· Lightweight mood tracker to guide pairing styles</li>
                    <li>Â· Timeline of experiments and learnings</li>
                  </ul>
                </>
              ) : (
                <>
                  <p className="font-semibold text-slate-100">
                    We&apos;re iterating
                  </p>
                  <p className="mt-2">
                    The beta is being reworked based on user feedback. Expect a
                    refreshed experience soon.
                  </p>
                </>
              )}
            </div>
            <div className="rounded-2xl border border-brand/40 bg-brand/10 p-5">
              <p className="text-sm text-brand-foreground">
                Want early access or to co-create the roadmap? Drop me a note
                from the homepage.
              </p>
            </div>
            <CardActions className="justify-end">
              <Link href="/" className={buttonClasses("secondary", "sm")}>
                Back to overview
              </Link>
            </CardActions>
          </div>
        </div>
      </Card>
    </section>
  );
};

export default VibeCodingPage;

