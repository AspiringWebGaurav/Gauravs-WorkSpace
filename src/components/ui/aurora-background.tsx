"use client";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface AuroraBackgroundProps {
  className?: string;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  showRadialGradient = true,
}: AuroraBackgroundProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className={cn("fixed inset-0 overflow-hidden pointer-events-none z-0", className)}>
      {/* Multi-layered base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/40"></div>
      
      {/* Complex aurora layers with different colors and positions - only render on client */}
      {isClient && (
        <>
          {/* Purple/Violet Aurora - Top Left */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 1, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div className={cn(
              "absolute -inset-10 opacity-40",
              "bg-[radial-gradient(600px_circle_at_20%_10%,rgba(139,92,246,0.4),rgba(168,85,247,0.2),transparent)]",
              "animate-aurora"
            )}></div>
          </motion.div>

          {/* Blue Aurora - Center Left */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div className={cn(
              "absolute -inset-10 opacity-35",
              "bg-[radial-gradient(500px_ellipse_at_0%_50%,rgba(59,130,246,0.5),rgba(99,102,241,0.3),transparent)]",
              "animate-aurora"
            )}
              style={{ animationDelay: "15s", animationDuration: "45s" }}
            ></div>
          </motion.div>

          {/* Cyan Aurora - Top Right */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div className={cn(
              "absolute -inset-10 opacity-30",
              "bg-[radial-gradient(550px_circle_at_80%_20%,rgba(6,182,212,0.4),rgba(34,211,238,0.2),transparent)]",
              "animate-aurora"
            )}
              style={{ animationDelay: "30s", animationDuration: "50s" }}
            ></div>
          </motion.div>

          {/* Emerald Aurora - Bottom Left */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div className={cn(
              "absolute -inset-10 opacity-25",
              "bg-[radial-gradient(450px_ellipse_at_20%_90%,rgba(16,185,129,0.3),rgba(52,211,153,0.2),transparent)]",
              "animate-aurora"
            )}
              style={{ animationDelay: "45s", animationDuration: "55s" }}
            ></div>
          </motion.div>

          {/* Pink Aurora - Center Right */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div className={cn(
              "absolute -inset-10 opacity-20",
              "bg-[radial-gradient(400px_circle_at_90%_60%,rgba(236,72,153,0.3),rgba(244,114,182,0.15),transparent)]",
              "animate-aurora"
            )}
              style={{ animationDelay: "60s", animationDuration: "40s" }}
            ></div>
          </motion.div>

          {/* Central Blended Aurora */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div className={cn(
              "absolute -inset-10 opacity-15",
              "bg-[radial-gradient(800px_ellipse_at_50%_50%,rgba(124,58,237,0.2),rgba(79,70,229,0.1),transparent)]",
              "animate-aurora"
            )}
              style={{ animationDelay: "10s", animationDuration: "70s" }}
            ></div>
          </motion.div>
        </>
      )}

      {/* Static aurora effects for SSR - fallback gradients that show before client hydration */}
      {!isClient && (
        <>
          <div className="absolute -inset-10 opacity-30 bg-[radial-gradient(600px_circle_at_20%_10%,rgba(139,92,246,0.3),transparent)]"></div>
          <div className="absolute -inset-10 opacity-25 bg-[radial-gradient(500px_ellipse_at_0%_50%,rgba(59,130,246,0.4),transparent)]"></div>
          <div className="absolute -inset-10 opacity-20 bg-[radial-gradient(550px_circle_at_80%_20%,rgba(6,182,212,0.3),transparent)]"></div>
        </>
      )}

      {/* Dynamic overlay gradients for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 dark:to-black/10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/5 dark:to-black/5"></div>

      {/* Enhanced radial gradient overlay */}
      {showRadialGradient && (
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-white/20 to-white/40 dark:via-black/20 dark:to-black/40"></div>
      )}
    </div>
  );
};