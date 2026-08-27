"use client";

import React from "react";
import { ProjectWithComputed } from "@/types/project";
import { cn } from "@/lib/utils";

interface KPICardsProps {
  projects: ProjectWithComputed[];
}

export function KPICards({ projects }: KPICardsProps) {
  const activeCount = projects.filter((p) => p.status === "active").length;
  const onTrackCount = projects.filter(
    (p) => p.status === "active" && (p.scheduleStatus === "on-track" || p.scheduleStatus === "ahead")
  ).length;
  const behindCount = projects.filter(
    (p) => p.status === "active" && p.scheduleStatus === "behind"
  ).length;
  const deadlinesSoonCount = projects.filter(
    (p) => p.status === "active" && p.daysRemaining >= 0 && p.daysRemaining <= 7
  ).length;

  const cards = [
    {
      label: "Active Projects",
      count: activeCount,
      icon: "account_tree",
      borderClass: "border-b-primary",
      numClass: "text-primary",
    },
    {
      label: "On Track",
      count: onTrackCount,
      icon: "check_circle",
      borderClass: "border-b-secondary",
      numClass: "text-secondary",
    },
    {
      label: "Behind Schedule",
      count: behindCount,
      icon: "warning",
      borderClass: "border-b-error-alert",
      numClass: "text-error-alert",
    },
    {
      label: "Deadlines Soon",
      count: deadlinesSoonCount,
      icon: "schedule",
      borderClass: "border-b-tertiary-fixed-dim",
      numClass: "text-on-surface",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className={cn(
            "flex flex-col justify-between rounded-[2px] border border-outline-variant/70 bg-surface-container-lowest p-5 shadow-xs transition-shadow hover:shadow-sm border-b-4",
            card.borderClass
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant font-mono">
              {card.label}
            </span>
            <span className="material-symbols-outlined text-outline-variant text-[20px]">
              {card.icon}
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={cn("font-mono text-3xl lg:text-4xl font-bold", card.numClass)}>
              {card.count}
            </span>
            <span className="text-xs text-on-surface-variant font-mono">OPERATIONAL</span>
          </div>
        </div>
      ))}
    </div>
  );
}
