"use client";

import React from "react";
import { useCountdown } from "@/hooks/use-countdown";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  startDate?: Date;
  endDate: Date;
  isCompleted?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function CountdownTimer({
  startDate,
  endDate,
  isCompleted = false,
  className,
  size = "lg",
}: CountdownTimerProps) {
  const time = useCountdown(endDate);

  if (isCompleted) {
    return (
      <div className={cn("flex items-center gap-2 text-secondary font-mono font-bold", className)}>
        <span className="material-symbols-outlined text-2xl">check_circle</span>
        <span>PROJECT COMPLETED</span>
      </div>
    );
  }

  if (!time) {
    return <div className="text-on-surface-variant font-mono">-- : -- : --</div>;
  }

  if (time.isOverdue) {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        <div className="flex items-center gap-1.5 text-error-alert font-mono font-bold tracking-wider">
          <span className="material-symbols-outlined text-lg animate-pulse">error</span>
          <span>DEADLINE PASSED</span>
        </div>
        <div className="font-mono text-2xl font-bold text-error-alert">
          {time.days}d {String(time.hours).padStart(2, "0")}h {String(time.minutes).padStart(2, "0")}m ago
        </div>
      </div>
    );
  }

  const d = String(time.days).padStart(2, "0");
  const h = String(time.hours).padStart(2, "0");
  const m = String(time.minutes).padStart(2, "0");
  const s = String(time.seconds).padStart(2, "0");

  if (size === "sm") {
    return (
      <div className={cn("font-mono text-sm font-semibold tracking-wider text-primary", className)}>
        {d}d : {h}h : {m}m : {s}s
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-baseline gap-2 font-mono text-4xl lg:text-5xl font-bold tracking-tight text-primary">
        <span>{d}</span>
        <span className="text-outline-variant text-3xl">:</span>
        <span>{h}</span>
        <span className="text-outline-variant text-3xl">:</span>
        <span>{m}</span>
        <span className="text-outline-variant text-3xl">:</span>
        <span className="text-primary-container text-2xl font-medium">{s}</span>
      </div>
      <div className="grid grid-cols-4 pt-1 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/80">
        <span>Days</span>
        <span className="pl-1">Hrs</span>
        <span className="pl-2">Min</span>
        <span className="pl-2 text-primary-container">Sec</span>
      </div>
    </div>
  );
}
