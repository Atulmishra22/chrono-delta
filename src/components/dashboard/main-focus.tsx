"use client";

import React from "react";
import Link from "next/link";
import { ProjectWithComputed } from "@/types/project";
import { ProgressBar } from "@/components/progress/progress-bar";
import { ScheduleStatusBadge } from "@/components/progress/schedule-status";
import { CountdownTimer } from "@/components/countdown/countdown-timer";
import { formatDate } from "@/lib/utils";

interface MainFocusProps {
  project: ProjectWithComputed | null;
}

export function MainFocus({ project }: MainFocusProps) {
  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[2px] border border-dashed border-outline-variant/80 bg-surface-container-lowest p-10 text-center">
        <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">rocket_launch</span>
        <h3 className="text-sm font-bold uppercase tracking-wider text-primary font-mono">
          No Critical Focus Project
        </h3>
        <p className="text-xs text-on-surface-variant mt-1 max-w-sm">
          Create a new project to start calculating real-time elapsed vs completed work metrics.
        </p>
        <Link
          href="/app/projects/new"
          className="mt-4 inline-flex items-center gap-1.5 rounded-[2px] bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:brightness-110"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          Create Project
        </Link>
      </div>
    );
  }

  const isBehind = project.scheduleStatus === "behind";

  return (
    <div className="relative overflow-hidden rounded-[2px] border border-outline-variant/80 bg-surface-container-lowest p-5 sm:p-6 lg:p-7 shadow-xs">
      {/* Subtle indicator accent */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${
          isBehind ? "bg-error-alert" : "bg-secondary"
        }`}
      />

      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-outline-variant/40">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-white">
            <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-primary/70 font-mono">
              Primary Objective
            </div>
            <h2 className="text-lg font-bold text-primary tracking-tight">{project.title}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ScheduleStatusBadge status={project.scheduleStatus} diff={project.scheduleDiff} />
          <Link
            href={`/app/projects/${project.id}`}
            className="flex h-7 w-7 items-center justify-center rounded-[2px] border border-outline-variant text-primary hover:bg-surface-container transition-colors"
            title="View Details"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
      </div>

      {/* T-Minus Countdown & Details Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-6 border-b border-outline-variant/40 items-center">
        <div className="md:col-span-7">
          <div className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant font-mono mb-1">
            Time Remaining (T-Minus)
          </div>
          <CountdownTimer endDate={project.endDate} isCompleted={project.progress === 100} />
        </div>

        <div className="md:col-span-5 flex flex-col gap-2.5 bg-surface-container-low/80 p-4 rounded-[2px] border border-outline-variant/30">
          <div className="flex justify-between items-center text-xs">
            <span className="text-on-surface-variant font-mono uppercase text-[11px]">Est. Completion</span>
            <span className="font-mono font-bold text-primary">{formatDate(project.endDate)}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-on-surface-variant font-mono uppercase text-[11px]">Category</span>
            <span className="font-mono font-semibold text-primary">{project.category}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-on-surface-variant font-mono uppercase text-[11px]">Schedule Delta</span>
            <span
              className={`font-mono font-bold ${
                project.scheduleDiff < 0
                  ? "text-error-alert"
                  : project.scheduleDiff > 0
                  ? "text-secondary"
                  : "text-primary"
              }`}
            >
              {project.scheduleDiff > 0 ? `+${project.scheduleDiff}%` : `${project.scheduleDiff}%`}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Intelligence Visualizers */}
      <div className="pt-6 flex flex-col gap-5">
        {/* Time Elapsed Progress */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="font-bold uppercase tracking-wider text-on-surface-variant text-[11px]">
              Time Elapsed
            </span>
            <span className="font-bold text-surface-tint">{project.timeProgress}%</span>
          </div>
          <ProgressBar value={project.timeProgress} color="surface-tint" height="lg" />
        </div>

        {/* Work Completed Progress */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="font-bold uppercase tracking-wider text-on-surface-variant text-[11px]">
              Work Completed{" "}
              <span
                className={`font-bold ${isBehind ? "text-error-alert" : "text-secondary"}`}
              >
                (Delta: {project.scheduleDiff > 0 ? `+${project.scheduleDiff}%` : `${project.scheduleDiff}%`})
              </span>
            </span>
            <span className={`font-bold ${isBehind ? "text-error-alert" : "text-secondary"}`}>
              {project.progress}%
            </span>
          </div>
          <ProgressBar
            value={project.progress}
            color={isBehind ? "error" : "secondary"}
            height="lg"
          />
        </div>
      </div>
    </div>
  );
}
