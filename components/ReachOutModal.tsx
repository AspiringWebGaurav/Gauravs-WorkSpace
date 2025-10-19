'use client';

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "./Button";
import Card, { CardActions, CardDescription, CardHeader, CardTitle } from "./Card";
import { createMessage } from "@/lib/firestore";
import { isAbusiveMessage } from "@/lib/abuse";
import { sha256 } from "@/lib/hash";
import { useToast } from "./Toast";

const schema = z.object({
  title: z
    .string()
    .min(4, "Please add a little more detail.")
    .max(120, "Keep titles short and crisp."),
  content: z
    .string()
    .min(20, "Tell me a bit more so I can respond thoughtfully.")
    .max(2000, "Let's keep it under 2000 characters."),
});

type FormValues = z.infer<typeof schema>;

interface ReachOutModalProps {
  open: boolean;
  onClose: () => void;
}

const ReachOutModal = ({ open, onClose }: ReachOutModalProps) => {
  const { pushToast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const closeAndReset = React.useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  const onSubmit = async (values: FormValues) => {
    if (!open || isSubmitting) return;
    if (isAbusiveMessage(values.title, values.content)) {
      pushToast({
        title: "Let's keep it respectful.",
        description:
          "The message looks a bit strong. Try rephrasing so we can collaborate productively.",
        intent: "error",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/ip");
      if (!response.ok) {
        throw new Error("Unable to establish network context");
      }
      const data = await response.json();
      const ip = typeof data.ip === "string" ? data.ip : "0.0.0.0";
      const ua = typeof navigator !== "undefined" ? navigator.userAgent : "unknown";
      const hashBase = `${ip}-${ua}`;
      const ipHash = await sha256(hashBase);

      await createMessage({
        title: values.title,
        content: values.content,
        ipHash,
        userAgent: ua,
        flags: { abusive: false },
      });

      pushToast({
        title: "Message sent!",
        description: "Thanks for reaching out. I'll reply shortly.",
        intent: "success",
      });
      closeAndReset();
    } catch (error) {
      console.error(error);
      pushToast({
        title: "Something went wrong.",
        description: "Please retry in a moment or email me directly.",
        intent: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reach-out-title"
    >
      <div className="max-w-lg w-full">
        <Card className="p-6">
          <CardHeader className="mb-2">
            <div>
              <CardTitle id="reach-out-title">Reach out to me</CardTitle>
              <CardDescription>
                Share your role, the opportunity, and anything that will help me respond fast.
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={closeAndReset} aria-label="Close">
              X
            </Button>
          </CardHeader>
          <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-xs font-semibold uppercase tracking-widest text-slate-400"
              >
                Title
              </label>
              <input
                id="title"
                autoFocus
                className="w-full rounded-xl border border-white/10 bg-surface-subtle px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/40"
                placeholder="Senior Product Engineer role"
                {...register("title")}
              />
              {errors.title ? (
                <p className="mt-1 text-xs text-danger">{errors.title.message}</p>
              ) : null}
            </div>
            <div>
              <label
                htmlFor="content"
                className="mb-2 block text-xs font-semibold uppercase tracking-widest text-slate-400"
              >
                Message
              </label>
              <textarea
                id="content"
                rows={5}
                className="w-full rounded-xl border border-white/10 bg-surface-subtle px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/40"
                placeholder="Tell me about the role, timeline, and who I'd be working with."
                {...register("content")}
              />
              {errors.content ? (
                <p className="mt-1 text-xs text-danger">{errors.content.message}</p>
              ) : (
                <p className="mt-1 text-xs text-slate-500">
                  No attachments neededâ€”just the essentials.
                </p>
              )}
            </div>
            <CardActions className="justify-end">
              <Button variant="ghost" size="sm" type="button" onClick={closeAndReset}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send message"}
              </Button>
            </CardActions>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ReachOutModal;

