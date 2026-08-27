"use client";

import React from "react";
import Link from "next/link";
import { ProjectWithComputed } from "@/types/project";
import { ProgressBar } from "@/components/progress/progress-bar";
import { ScheduleStatusBadge } from "@/components/progress/schedule-status";
import { formatDate } from "@/lib/utils";

interface ProjectCardProps {
  project: ProjectWithComputed;
  onDelete?: (id: string) => Promise<void>;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const isBehind = project.scheduleStatus === "behind";

  return (
    <div className="flex flex-col justify-between rounded-[2px] border border-outline-variant/80 bg-surface-container-lowest p-6 shadow-xs hover:shadow-sm transition-all border-t-2 border-t-primary">
      <div>
        {/* Top bar: Category + Status Badge */}
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
          <span className="rounded-[2px] bg-surface-container px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
            {project.category}
          </span>
          <ScheduleStatusBadge status={project.scheduleStatus} diff={project.scheduleDiff} />
        </div>

        {/* Project Title & Description */}
        <div className="mt-4">
          <Link
            href={`/app/projects/${project.id}`}
            className="text-base font-bold text-primary hover:underline leading-snug"
          >
            {project.title}
          </Link>
          {project.description && (
            <p className="mt-1 text-xs text-on-surface-variant line-clamp-2">
              {project.description}
            </p>
          )}
        </div>

        {/* Date Range */}
        <div className="mt-4 flex items-center gap-1.5 font-mono text-xs text-on-surface-variant">
          <span className="material-symbols-outlined text-[14px]">calendar_today</span>
          <span>
            {formatDate(project.startDate)} &rarr; {formatDate(project.endDate)}
          </span>
        </div>

        {/* Dual Progress Visualizers */}
        <div className="mt-5 flex flex-col gap-3.5">
          {/* Time Elapsed */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-on-surface-variant uppercase font-bold">Time Elapsed</span>
              <span className="font-bold text-surface-tint">{project.timeProgress}%</span>
            </div>
            <ProgressBar value={project.timeProgress} color="surface-tint" height="sm" />
          </div>

          {/* Work Completed */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-on-surface-variant uppercase font-bold">Work Done</span>
              <span className={`font-bold ${isBehind ? "text-error-alert" : "text-secondary"}`}>
                {project.progress}%
              </span>
            </div>
            <ProgressBar
              value={project.progress}
              color={isBehind ? "error" : "secondary"}
              height="sm"
            />
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-6 pt-4 border-t border-outline-variant/40 flex items-center justify-between">
        <span
          className={`font-mono text-xs font-semibold ${
            project.isOverdue ? "text-error-alert font-bold" : "text-on-surface-variant"
          }`}
        >
          {project.daysRemaining < 0
            ? `Overdue (${Math.abs(project.daysRemaining)}d)`
            : `${project.daysRemaining} days remaining`}
        </span>

        <div className="flex items-center gap-1">
          {onDelete && (
            <button
              onClick={() => onDelete(project.id)}
              className="p-1.5 text-on-surface-variant hover:text-error-alert transition-colors"
              title="Delete Project"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
            </button>
          )}
          <Link
            href={`/app/projects/${project.id}`}
            className="flex items-center gap-1 rounded-[2px] bg-primary px-3 py-1 text-xs font-bold text-white uppercase font-mono hover:brightness-110"
          >
            <span>Open</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
