'use client';

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Card, {
  CardActions,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/Card";
import Button from "@/components/Button";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/Toast";

const schema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type FormValues = z.infer<typeof schema>;

const adminEmail =
  process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase().trim() ?? "";

const AdminLoginPage = () => {
  const router = useRouter();
  const { signIn, user, isLoading } = useAuth();
  const { pushToast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!user?.email) return;
    if (user.email.toLowerCase() === adminEmail) {
      router.replace("/admin/dashboard");
    } else {
      pushToast({
        title: "Access denied",
        description: "This account is not authorized for the admin console.",
        intent: "error",
      });
    }
  }, [user, router, pushToast]);

  const onSubmit = async (values: FormValues) => {
    if (submitting) return;
    if (!adminEmail || values.email.toLowerCase() !== adminEmail) {
      pushToast({
        title: "Invalid credentials",
        description: "Use the admin email configured for this workspace.",
        intent: "error",
      });
      return;
    }
    setSubmitting(true);
    try {
      await signIn(values.email, values.password);
      router.replace("/admin/dashboard");
    } catch (error) {
      console.error(error);
      pushToast({
        title: "Sign-in failed",
        description: "Double-check your credentials and try again.",
        intent: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-[calc(100vh-220px)] w-full max-w-lg flex-col justify-center px-4 py-8 md:py-12">
      <Card className="p-8">
        <CardHeader>
          <div>
            <CardTitle>Admin Access</CardTitle>
            <CardDescription>
              Secure area for managing messages, projects, and settings.
            </CardDescription>
          </div>
        </CardHeader>
        <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-xs font-semibold uppercase tracking-[0.28em] text-slate-400"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-xl border border-white/10 bg-surface-subtle px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/40"
              placeholder="admin@example.com"
              autoComplete="email"
              {...register("email")}
            />
            {errors.email ? (
              <p className="mt-1 text-xs text-danger">{errors.email.message}</p>
            ) : null}
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-xs font-semibold uppercase tracking-[0.28em] text-slate-400"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-xl border border-white/10 bg-surface-subtle px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/40"
              placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
              autoComplete="current-password"
              {...register("password")}
            />
            {errors.password ? (
              <p className="mt-1 text-xs text-danger">
                {errors.password.message}
              </p>
            ) : (
              <p className="mt-1 text-xs text-slate-500">
                Credentials are provisioned via Firebase Auth.
              </p>
            )}
          </div>
          <CardActions className="justify-end">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={submitting || isLoading}
            >
              {submitting ? "Signing inâ€¦" : "Sign in"}
            </Button>
          </CardActions>
        </form>
      </Card>
    </section>
  );
};

export default AdminLoginPage;

