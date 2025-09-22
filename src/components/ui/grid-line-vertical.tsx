"use client";

import { cn } from "@/lib/utils";

interface GridLineVerticalProps {
  className?: string;
  offset?: string;
  style?: React.CSSProperties;
}

export const GridLineVertical = ({
  className,
  offset = "200px",
  style,
}: GridLineVerticalProps) => {
  return (
    <div
      className={cn(
        "absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-300/20 to-transparent dark:via-gray-600/20",
        className
      )}
      style={{
        transform: `translateY(${offset})`,
        ...style,
      }}
    />
  );
};