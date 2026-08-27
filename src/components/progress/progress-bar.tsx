"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0-100
  color?: "primary" | "secondary" | "error" | "surface-tint" | "outline";
  height?: "xs" | "sm" | "md" | "lg";
  showTicks?: boolean;
  className?: string;
  animate?: boolean;
}

export function ProgressBar({
  value,
  color = "primary",
  height = "md",
  showTicks = true,
  className,
  animate = true,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  const heightClasses = {
    xs: "h-1.5",
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  const fillColors = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    error: "bg-error-alert",
    "surface-tint": "bg-surface-tint",
    outline: "bg-outline",
  };

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-[2px] bg-surface-container-high",
        heightClasses[height],
        className
      )}
    >
      {/* Background track ticks at 10% increments */}
      {showTicks && (
        <div className="progress-ticks-container px-[1px]">
          {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((tick) => (
            <div
              key={tick}
              className="progress-tick-dark"
              style={{ position: "absolute", left: `${tick}%` }}
            />
          ))}
        </div>
      )}

      {/* Animated filled progress bar */}
      <motion.div
        className={cn("relative h-full", fillColors[color])}
        initial={animate ? { width: 0 } : { width: `${clamped}%` }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* White tick marks inside the filled progress */}
        {showTicks && (
          <div className="progress-ticks-container px-[1px]">
            {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((tick) => (
              <div
                key={tick}
                className="progress-tick"
                style={{ position: "absolute", left: `${tick}%` }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
