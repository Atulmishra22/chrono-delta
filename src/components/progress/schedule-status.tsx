import React from "react";
import { ScheduleStatus } from "@/types/project";
import { cn } from "@/lib/utils";

interface ScheduleStatusBadgeProps {
  status: ScheduleStatus;
  diff?: number;
  className?: string;
  variant?: "pill" | "dot";
}

export function ScheduleStatusBadge({
  status,
  diff,
  className,
  variant = "pill",
}: ScheduleStatusBadgeProps) {
  if (variant === "dot") {
    if (status === "behind") {
      return (
        <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold text-error-alert font-mono", className)}>
          <span className="h-2 w-2 rounded-full bg-error-alert animate-pulse" />
          BEHIND SCHEDULE {diff !== undefined && `(${diff}%)`}
        </span>
      );
    }
    if (status === "ahead") {
      return (
        <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold text-secondary font-mono", className)}>
          <span className="h-2 w-2 rounded-full bg-secondary" />
          AHEAD OF SCHEDULE {diff !== undefined && `(+${diff}%)`}
        </span>
      );
    }
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold text-secondary font-mono", className)}>
        <span className="h-2 w-2 rounded-full bg-secondary" />
        ON TRACK
      </span>
    );
  }

  if (status === "behind") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold tracking-wider uppercase rounded-[2px] bg-error-container text-on-error-container border border-error-alert/30 font-mono",
          className
        )}
      >
        <span className="material-symbols-outlined text-[14px]">warning</span>
        Behind Schedule {diff !== undefined && `(${diff}%)`}
      </span>
    );
  }

  if (status === "ahead") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold tracking-wider uppercase rounded-[2px] bg-secondary-container text-on-secondary-container border border-secondary/30 font-mono",
          className
        )}
      >
        <span className="material-symbols-outlined text-[14px]">check_circle</span>
        Ahead of Schedule {diff !== undefined && `(+${diff}%)`}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold tracking-wider uppercase rounded-[2px] bg-secondary-container/60 text-on-secondary-container border border-secondary/20 font-mono",
        className
      )}
    >
      <span className="material-symbols-outlined text-[14px]">check_circle</span>
      On Track
    </span>
  );
}
