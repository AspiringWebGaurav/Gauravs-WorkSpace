'use client';

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Timestamp } from "firebase/firestore";
import Button, { buttonClasses } from "@/components/Button";
import Card, {
  CardActions,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/Card";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/Toast";
import {
  deleteProject,
  fetchAllProjects,
  fetchRepliesForMessage,
  listMessages,
  replyToMessage,
  updateMessageStatus,
  type MessageDoc,
  type MessageReply,
  type ProjectDoc,
  updateSettings,
  fetchSettings,
  upsertProject,
} from "@/lib/firestore";
import { uploadFile } from "@/lib/storage";
import { formatDate } from "@/lib/utils";
import { useSettings } from "@/components/SettingsProvider";
import { cn } from "@/lib/utils";

type TabKey = "messages" | "projects" | "settings";

const adminEmail =
  process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase().trim() ?? "";

const AdminDashboardPage = () => {
  const router = useRouter();
  const { user, isLoading, signOutUser } = useAuth();
  const { pushToast } = useToast();
  const { settings, setSettings } = useSettings();
  const [activeTab, setActiveTab] = React.useState<TabKey>("messages");

  React.useEffect(() => {
    if (isLoading) return;
    if (!user?.email || user.email.toLowerCase() !== adminEmail) {
      pushToast({
        title: "Authentication required",
        description: "Sign in with the authorized admin account first.",
        intent: "error",
      });
      router.replace("/admin");
    }
  }, [user, isLoading, router, pushToast]);

  const handleSignOut = async () => {
    await signOutUser();
    pushToast({
      title: "Signed out",
      description: "You are now signed out of the admin console.",
      intent: "info",
    });
    router.replace("/admin");
  };

  return (
    <section className="mx-auto flex min-h-[calc(100vh-220px)] w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-semibold text-slate-100">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-400">
            Review messages, tune projects, and keep the workspace up to date.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-400">
            {user?.email ?? "Guest"}
          </span>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <TabButton
          label="Messages"
          active={activeTab === "messages"}
          onClick={() => setActiveTab("messages")}
        />
        <TabButton
          label="Projects"
          active={activeTab === "projects"}
          onClick={() => setActiveTab("projects")}
        />
        <TabButton
          label="Settings"
          active={activeTab === "settings"}
          onClick={() => setActiveTab("settings")}
        />
      </div>
      <div className="flex-1">
        {activeTab === "messages" ? (
          <MessagesPanel />
        ) : activeTab === "projects" ? (
          <ProjectsPanel />
        ) : (
          <SettingsPanel
            currentSettings={settings}
            onSettingsUpdated={(next) => setSettings(next)}
          />
        )}
      </div>
    </section>
  );
};

const TabButton = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "rounded-full border px-5 py-2 text-sm font-semibold uppercase tracking-[0.24em] transition",
      active
        ? "border-brand bg-brand/30 text-brand-foreground"
        : "border-white/10 bg-white/5 text-slate-300 hover:border-brand/40 hover:text-slate-100"
    )}
  >
    {label}
  </button>
);

const MessagesPanel = () => {
  const { pushToast } = useToast();
  const [messages, setMessages] = React.useState<MessageDoc[]>([]);
  const [selectedMessage, setSelectedMessage] = React.useState<MessageDoc | null>(null);
  const [replies, setReplies] = React.useState<MessageReply[]>([]);
  const [filter, setFilter] = React.useState<"all" | "new" | "read" | "answered">(
    "all"
  );
  const [isLoading, setIsLoading] = React.useState(true);
  const replyRef = React.useRef<HTMLTextAreaElement>(null);

  const loadMessages = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await listMessages();
      setMessages(data);
      if (data.length) {
        setSelectedMessage(data[0]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  React.useEffect(() => {
    const loadReplies = async () => {
      if (!selectedMessage) {
        setReplies([]);
        return;
      }
      const data = await fetchRepliesForMessage(selectedMessage.id);
      setReplies(data);
    };
    void loadReplies();
  }, [selectedMessage]);

  const filteredMessages =
    filter === "all"
      ? messages
      : messages.filter((message) => message.status === filter);

  const handleStatusChange = async (
    message: MessageDoc,
    status: "new" | "read" | "answered"
  ) => {
    await updateMessageStatus(message.id, status);
    pushToast({
      title: "Message updated",
      description: `Marked as ${status}.`,
      intent: "success",
    });
    void loadMessages();
  };

  const handleReply = async (message: MessageDoc) => {
    const content = replyRef.current?.value?.trim();
    if (!content) {
      pushToast({
        title: "Add a reply first",
        description: "Write a short response before sending.",
        intent: "info",
      });
      return;
    }
    await replyToMessage(message.id, content);
    pushToast({
      title: "Reply sent",
      description: "The sender will receive your answer soon.",
      intent: "success",
    });
    if (replyRef.current) {
      replyRef.current.value = "";
    }
    void loadMessages();
  };

  return (
    <div className="grid gap-6 md:grid-cols-[280px_1fr]">
      <Card className="max-h-[60vh] overflow-y-auto p-0">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">
            Inbox
          </h2>
          <select
            value={filter}
            onChange={(event) =>
              setFilter(event.target.value as typeof filter)
            }
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">All</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="answered">Answered</option>
          </select>
        </div>
        <div className="divide-y divide-white/5">
          {isLoading ? (
            <div className="px-5 py-6 text-sm text-slate-400">
              Loading messagesâ€¦
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="px-5 py-6 text-sm text-slate-400">
              No messages in this view.
            </div>
          ) : (
            filteredMessages.map((message) => (
              <button
                key={message.id}
                type="button"
                onClick={() => setSelectedMessage(message)}
                className={cn(
                  "w-full px-5 py-4 text-left transition hover:bg-white/5",
                  selectedMessage?.id === message.id ? "bg-brand/10" : ""
                )}
              >
                <p className="text-sm font-semibold text-slate-100">
                  {message.title}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {formatDate(message.createdAt?.toDate?.())}
                </p>
                <span className="mt-2 inline-flex items-center rounded-full bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.3em] text-slate-400">
                  {message.status}
                </span>
                {message.flags?.abusive ? (
                  <span className="ml-2 rounded-full bg-danger/10 px-2 py-1 text-[10px] uppercase tracking-[0.3em] text-danger">
                    Flagged
                  </span>
                ) : null}
              </button>
            ))
          )}
        </div>
      </Card>
      <Card className="min-h-[60vh] p-6">
        {selectedMessage ? (
          <>
            <header className="flex flex-col gap-2 border-b border-white/10 pb-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-100">
                  {selectedMessage.title}
                </h2>
                <p className="text-xs text-slate-400">
                  Received {formatDate(selectedMessage.createdAt?.toDate?.())}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedMessage, "read")}
                  className={buttonClasses("secondary", "sm")}
                >
                  Mark read
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleStatusChange(selectedMessage, "answered")
                  }
                  className={buttonClasses("primary", "sm")}
                >
                  Mark answered
                </button>
              </div>
            </header>
            <article className="mt-4 space-y-4 text-sm text-slate-200">
              <p className="whitespace-pre-line leading-relaxed">
                {selectedMessage.content}
              </p>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-slate-400">
                <p>IP Hash: {selectedMessage.ipHash}</p>
                <p className="mt-1">
                  User Agent: {selectedMessage.userAgent || "â€”"}
                </p>
              </div>
            </article>
            <section className="mt-6 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Replies
              </h3>
              {replies.length === 0 ? (
                <p className="text-xs text-slate-500">
                  No replies yet. Start the thread below.
                </p>
              ) : (
                <div className="space-y-3">
                  {replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200"
                    >
                      <p className="text-xs text-slate-400">
                        {formatDate(reply.createdAt?.toDate?.())}
                      </p>
                      <p className="mt-2 whitespace-pre-line leading-relaxed">
                        {reply.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
            <section className="mt-6">
              <label
                htmlFor="reply"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"
              >
                Send a reply
              </label>
              <textarea
                id="reply"
                ref={replyRef}
                rows={4}
                className="w-full rounded-xl border border-white/10 bg-surface-subtle px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/40"
                placeholder="Thanks for reaching outâ€”letâ€™s schedule a call this weekâ€¦"
              />
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleReply(selectedMessage)}
                  className={buttonClasses("primary", "sm")}
                >
                  Send reply
                </button>
              </div>
            </section>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            Select a message to view details.
          </div>
        )}
      </Card>
    </div>
  );
};

const createEmptyProject = (): ProjectDoc => ({
  title: "",
  slug: "",
  summary: "",
  imagePath: "",
  imageUrl: "",
  updatedAt: Timestamp.now(),
  published: false,
  tags: [],
});

const ProjectsPanel = () => {
  const { pushToast } = useToast();
  const [projects, setProjects] = React.useState<ProjectDoc[]>([]);
  const [selectedProject, setSelectedProject] = React.useState<ProjectDoc | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const imageInputRef = React.useRef<HTMLInputElement>(null);

  const loadProjects = React.useCallback(async () => {
    setIsLoading(true);
    const data = await fetchAllProjects();
    if (!data.some((project) => project.slug === "vibecoding")) {
      const placeholder = {
        ...createEmptyProject(),
        title: "VibeCoding",
        slug: "vibecoding",
        summary: "Hold space for ongoing beta experiments.",
        published: false,
      };
      await upsertProject(placeholder);
      data.push(placeholder);
    }
    setProjects(data);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  React.useEffect(() => {
    if (projects.length && !selectedProject) {
      setSelectedProject(projects[0]);
    }
  }, [projects, selectedProject]);

  const updateField = <K extends keyof ProjectDoc>(
    key: K,
    value: ProjectDoc[K]
  ) => {
    if (!selectedProject) return;
    setSelectedProject({ ...selectedProject, [key]: value });
  };

  const handleSave = async () => {
    if (!selectedProject) return;
    if (!selectedProject.title || !selectedProject.slug) {
      pushToast({
        title: "Missing title or slug",
        description: "Both fields are required to save a project.",
        intent: "error",
      });
      return;
    }
    setIsSaving(true);
    try {
      const projectId = await upsertProject(selectedProject);
      pushToast({
        title: "Project saved",
        description: "Your project updates are live.",
        intent: "success",
      });
      setSelectedProject({ ...selectedProject, id: projectId });
      void loadProjects();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProject?.id) return;
    await deleteProject(selectedProject.id);
    pushToast({
      title: "Project deleted",
      description: "The project has been removed.",
      intent: "info",
    });
    setSelectedProject(null);
    void loadProjects();
  };

  const handleImageUpload = async (file: File) => {
    if (!selectedProject) return;
    const path = `project-images/${selectedProject.slug || file.name}-${Date.now()}`;
    const { url, path: storagePath } = await uploadFile(path, file, {
      contentType: file.type,
    });
    updateField("imageUrl", url);
    updateField("imagePath", storagePath);
    pushToast({
      title: "Image uploaded",
      description: "Preview updated successfully.",
      intent: "success",
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-[280px_1fr]">
      <Card className="max-h-[60vh] overflow-y-auto p-0">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">
            Projects
          </h2>
          <button
            type="button"
            className={buttonClasses("secondary", "sm")}
            onClick={() => setSelectedProject(createEmptyProject())}
          >
            New
          </button>
        </div>
        <div className="divide-y divide-white/5">
          {isLoading ? (
            <div className="px-5 py-6 text-sm text-slate-400">
              Loading projectsâ€¦
            </div>
          ) : projects.length === 0 ? (
            <div className="px-5 py-6 text-sm text-slate-400">
              No projects yet. Create one to get started.
            </div>
          ) : (
            projects.map((project) => (
              <button
                key={project.id ?? project.slug}
                type="button"
                onClick={() => setSelectedProject(project)}
                className={cn(
                  "w-full px-5 py-4 text-left transition hover:bg-white/5",
                  selectedProject?.slug === project.slug ? "bg-brand/10" : ""
                )}
              >
                <p className="text-sm font-semibold text-slate-100">
                  {project.title}
                </p>
                <p className="text-xs text-slate-400">{project.slug}</p>
                <span className="mt-2 inline-flex items-center rounded-full bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.3em] text-slate-400">
                  {project.published ? "Published" : "Draft"}
                </span>
              </button>
            ))
          )}
        </div>
      </Card>
      <Card className="p-6">
        {selectedProject ? (
          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              void handleSave();
            }}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="project-title"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"
                >
                  Title
                </label>
                <input
                  id="project-title"
                  value={selectedProject.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-surface-subtle px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/40"
                />
              </div>
              <div>
                <label
                  htmlFor="project-slug"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"
                >
                  Slug
                </label>
                <input
                  id="project-slug"
                  value={selectedProject.slug}
                  onChange={(event) =>
                    updateField("slug", event.target.value.toLowerCase())
                  }
                  className="w-full rounded-xl border border-white/10 bg-surface-subtle px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/40"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="project-summary"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"
              >
                Summary
              </label>
              <textarea
                id="project-summary"
                value={selectedProject.summary}
                onChange={(event) =>
                  updateField("summary", event.target.value)
                }
                rows={3}
                className="w-full rounded-xl border border-white/10 bg-surface-subtle px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/40"
              />
            </div>
            <div>
              <label
                htmlFor="project-tags"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"
              >
                Tags
              </label>
              <input
                id="project-tags"
                value={selectedProject.tags?.join(", ") ?? ""}
                onChange={(event) =>
                  updateField(
                    "tags",
                    event.target.value
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean)
                  )
                }
                className="w-full rounded-xl border border-white/10 bg-surface-subtle px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/40"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Preview image
              </label>
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="relative h-32 w-full overflow-hidden rounded-xl border border-white/10 bg-surface-subtle md:w-48">
                  {selectedProject.imageUrl ? (
                    <Image
                      src={selectedProject.imageUrl}
                      alt={selectedProject.title || "Project preview"}
                      fill
                      className="object-cover"
                      sizes="192px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-slate-400">
                      No image yet
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className={buttonClasses("secondary", "sm")}
                    onClick={() => imageInputRef.current?.click()}
                  >
                    Upload
                  </button>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        void handleImageUpload(file);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm text-slate-300">
                <input
                  type="checkbox"
                  className="mr-2 rounded border border-white/10 bg-transparent"
                  checked={selectedProject.published}
                  onChange={(event) =>
                    updateField("published", event.target.checked)
                  }
                />
                Published
              </label>
            </div>
            <CardActions className="justify-between">
              <div>
                <p className="text-xs text-slate-500">
                  Updated at{" "}
                  {selectedProject.updatedAt?.toDate
                    ? formatDate(selectedProject.updatedAt.toDate())
                    : "â€”"}
                </p>
              </div>
              <div className="flex gap-3">
                {selectedProject?.id ? (
                  <button
                    type="button"
                    onClick={() => void handleDelete()}
                    className={buttonClasses("ghost", "sm")}
                  >
                    Delete
                  </button>
                ) : null}
                <button
                  type="submit"
                  className={buttonClasses("primary", "sm")}
                  disabled={isSaving}
                >
                  {isSaving ? "Savingâ€¦" : "Save"}
                </button>
              </div>
            </CardActions>
          </form>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            Select a project or create a new one.
          </div>
        )}
      </Card>
    </div>
  );
};

const SettingsPanel = ({
  currentSettings,
  onSettingsUpdated,
}: {
  currentSettings: Awaited<ReturnType<typeof fetchSettings>> | null;
  onSettingsUpdated: (settings: Awaited<ReturnType<typeof fetchSettings>> | null) => void;
}) => {
  const { pushToast } = useToast();
  const [resumeUrl, setResumeUrl] = React.useState(
    currentSettings?.resumeUrl ?? ""
  );
  const [github, setGithub] = React.useState(
    currentSettings?.social?.github ?? ""
  );
  const [linkedin, setLinkedin] = React.useState(
    currentSettings?.social?.linkedin ?? ""
  );
  const [saving, setSaving] = React.useState(false);
  const resumeInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setResumeUrl(currentSettings?.resumeUrl ?? "");
    setGithub(currentSettings?.social?.github ?? "");
    setLinkedin(currentSettings?.social?.linkedin ?? "");
  }, [currentSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = {
        resumeUrl,
        social: {
          github,
          linkedin,
        },
      };
      await updateSettings(updates);
      const latest = await fetchSettings();
      onSettingsUpdated(latest);
      pushToast({
        title: "Settings updated",
        description: "Public data synced successfully.",
        intent: "success",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (file: File) => {
    const path = `resumes/${Date.now()}-${file.name}`;
    const { url } = await uploadFile(path, file, {
      contentType: file.type,
    });
    setResumeUrl(url);
    pushToast({
      title: "Resume uploaded",
      description: "Resume link updated to the new file.",
      intent: "success",
    });
  };

  return (
    <Card className="space-y-6 p-6">
      <div>
        <CardHeader className="px-0">
          <div>
            <CardTitle>Workspace Settings</CardTitle>
            <CardDescription>
              Control what visitors can download and which social links appear.
            </CardDescription>
          </div>
        </CardHeader>
      </div>
      <div>
        <label
          htmlFor="resume-url"
          className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"
        >
          Resume download URL
        </label>
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            id="resume-url"
            value={resumeUrl}
            onChange={(event) => setResumeUrl(event.target.value)}
            className="flex-1 rounded-xl border border-white/10 bg-surface-subtle px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/40"
          />
          <div className="flex gap-3">
            <button
              type="button"
              className={buttonClasses("secondary", "sm")}
              onClick={() => resumeInputRef.current?.click()}
            >
              Upload PDF
            </button>
            <input
              ref={resumeInputRef}
              type="file"
              accept="application/pdf"
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void handleResumeUpload(file);
                }
              }}
            />
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="github"
            className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"
          >
            GitHub URL
          </label>
          <input
            id="github"
            value={github}
            onChange={(event) => setGithub(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-surface-subtle px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/40"
          />
        </div>
        <div>
          <label
            htmlFor="linkedin"
            className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"
          >
            LinkedIn URL
          </label>
          <input
            id="linkedin"
            value={linkedin}
            onChange={(event) => setLinkedin(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-surface-subtle px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/40"
          />
        </div>
      </div>
      <CardActions className="justify-end">
        <button
          type="button"
          onClick={() => void handleSave()}
          className={buttonClasses("primary", "sm")}
          disabled={saving}
        >
          {saving ? "Savingâ€¦" : "Save settings"}
        </button>
      </CardActions>
    </Card>
  );
};

export default AdminDashboardPage;

