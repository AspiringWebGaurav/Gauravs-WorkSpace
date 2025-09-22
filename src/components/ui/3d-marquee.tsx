"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { GridLineHorizontal } from "./grid-line-horizontal";
import { GridLineVertical } from "./grid-line-vertical";

interface ThreeDMarqueeProps {
  images: string[];
  className?: string;
  pauseOnHover?: boolean;
  direction?: "up" | "down" | "left" | "right";
}

const FALLBACK_IMAGES = [
  "/icon-512x512.png",
  "/logo-1024.png",
  "/og-image.png",
  "/window.svg",
  "/file.svg",
  "/globe.svg",
];

export const ThreeDMarquee = ({
  images,
  className,
  pauseOnHover = true,
  direction = "up",
}: ThreeDMarqueeProps) => {
  const [isClient, setIsClient] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const displayImages = images.length > 0 ? images : FALLBACK_IMAGES;
  
  // Create multiple rows with different images and animation speeds
  const createImageRows = () => {
    const rows = [];
    const numRows = 4;
    
    for (let i = 0; i < numRows; i++) {
      const rowImages = [...displayImages, ...displayImages]; // Duplicate for seamless loop
      const isEven = i % 2 === 0;
      const animationDuration = 20 + i * 5; // Different speeds for each row
      
      rows.push(
        <motion.div
          key={i}
          className={cn(
            "flex gap-6 md:gap-8 lg:gap-12 absolute whitespace-nowrap",
            "transform-gpu will-change-transform"
          )}
          style={{
            top: `${i * 25}%`,
            transform: `rotateX(${10 - i * 2}deg) translateZ(${i * 20}px)`,
          }}
          animate={
            isPaused
              ? {}
              : {
                  x: isEven ? [0, -1920] : [-1920, 0],
                }
          }
          transition={{
            duration: animationDuration,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          {rowImages.map((image, index) => (
            <div
              key={`${i}-${index}`}
              className={cn(
                "relative flex-shrink-0 rounded-lg overflow-hidden",
                "w-32 h-24 md:w-40 md:h-30 lg:w-48 lg:h-36",
                "border border-gray-200/20 dark:border-gray-700/20",
                "shadow-lg backdrop-blur-sm",
                "bg-white/5 dark:bg-black/5"
              )}
              style={{
                transform: `rotateY(${isEven ? -5 : 5}deg) scale(${0.8 + i * 0.05})`,
              }}
            >
              <Image
                src={image}
                alt={`Marquee image ${index + 1}`}
                fill
                sizes="(max-width: 768px) 128px, (max-width: 1024px) 160px, 192px"
                className={cn(
                  "object-cover transition-opacity duration-300",
                  image.endsWith('.svg') ? "object-contain p-4" : "object-cover"
                )}
                style={{
                  opacity: 0.7 + i * 0.1,
                }}
              />
              {/* Overlay for better integration */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 mix-blend-overlay" />
            </div>
          ))}
        </motion.div>
      );
    }
    
    return rows;
  };

  return (
    <div
      className={cn(
        "relative w-full h-full overflow-hidden",
        "perspective-1000",
        className
      )}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {/* 3D Container with perspective */}
      <div className="absolute inset-0 transform-style-preserve-3d">
        {/* Grid Lines for 3D effect */}
        {isClient && (
          <>
            {/* Horizontal grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <GridLineHorizontal
                key={`h-${i}`}
                className="animate-pulse"
                offset={`${i * 25}%`}
                style={{
                  top: `${i * 20}%`,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
            
            {/* Vertical grid lines */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <GridLineVertical
                key={`v-${i}`}
                className="animate-pulse"
                offset={`${i * 16.66}%`}
                style={{
                  left: `${i * 16.66}%`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </>
        )}

        {/* 3D Marquee Images */}
        <div className={cn(
          "absolute inset-0",
          "transform-style-preserve-3d",
          direction === "up" && "rotate-x-12",
          direction === "down" && "-rotate-x-12",
          direction === "left" && "rotate-y-12",
          direction === "right" && "-rotate-y-12"
        )}>
          {isClient && createImageRows()}
        </div>

        {/* Gradient overlays for fading edges */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 dark:from-black/20 dark:to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-white/20 dark:from-black/20 dark:to-black/20" />
        
        {/* Central focus area */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-white/10 dark:to-black/10" />
      </div>

      {/* Fallback for non-client render */}
      {!isClient && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10" />
      )}
    </div>
  );
};