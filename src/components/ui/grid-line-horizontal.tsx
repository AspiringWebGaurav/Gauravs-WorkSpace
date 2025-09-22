"use client";

import { cn } from "@/lib/utils";

interface GridLineHorizontalProps {
  className?: string;
  offset?: string;
  style?: React.CSSProperties;
}

export const GridLineHorizontal = ({
  className,
  offset = "200px",
  style,
}: GridLineHorizontalProps) => {
  return (
    <div
      className={cn(
        "absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300/20 to-transparent dark:via-gray-600/20",
        className
      )}
      style={{
        transform: `translateX(${offset})`,
        ...style,
      }}
    />
  );
};