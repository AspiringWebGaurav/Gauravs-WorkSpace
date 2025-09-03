"use client";
import React from "react";
import { cn } from "@/lib/utils";

export function MovingBorderButton({
  borderRadius = "1.5rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration = 4000,
  className,
  ...otherProps
}: {
  borderRadius?: string;
  children: React.ReactNode;
  as?: any;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
  [key: string]: any;
}) {
  return (
    <Component
      className={cn(
        "bg-transparent relative p-[1px] overflow-hidden",
        containerClassName
      )}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}
    >
      {/* Outer glowing border */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-conic from-violet-500 via-blue-500 via-cyan-500 via-purple-500 to-violet-500 animate-spin",
          borderClassName
        )}
        style={{
          borderRadius: borderRadius,
          animationDuration: `${duration}ms`,
          filter: "blur(1px)",
        }}
      />
      
      {/* Inner content */}
      <div
        className={cn(
          "relative bg-white/[0.08] dark:bg-black/[0.12] backdrop-blur-md text-gray-900 dark:text-white flex items-center justify-center w-full h-full text-sm font-medium antialiased border border-white/[0.1] dark:border-white/[0.05]",
          className
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {/* Subtle inner glow */}
        <div
          className="absolute inset-0 bg-gradient-conic from-violet-500/10 via-blue-500/10 via-cyan-500/10 via-purple-500/10 to-violet-500/10 animate-spin opacity-50"
          style={{
            borderRadius: `calc(${borderRadius} * 0.96)`,
            animationDuration: `${duration * 0.8}ms`,
            animationDirection: "reverse",
          }}
        />
        
        <div className="relative z-10 flex items-center gap-2">
          {children}
        </div>
      </div>
    </Component>
  );
}

// Export as Button for backward compatibility
export const Button = MovingBorderButton;