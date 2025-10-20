"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type CardProps = React.HTMLAttributes<HTMLDivElement>;

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "glass relative flex flex-col rounded-2xl border border-white/5 bg-surface/90 p-6 shadow-card transition-all duration-200",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

export type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("mb-4 flex items-start justify-between gap-4", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={cn("text-lg font-semibold text-slate-50 md:text-xl", className)}
    {...props}
  />
);

export const CardDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-sm text-slate-300", className)} {...props} />
);

export const CardBadge = ({
  className,
  children,
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full border border-accent/60 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent",
      className
    )}
  >
    {children}
  </span>
);

export const CardActions = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "mt-6 flex flex-wrap items-center gap-3 relative z-10",
      className
    )}
    {...props}
  />
);

export default Card;
