"use client";

import React from "react";
import { ProjectWithComputed } from "@/types/project";
import { Task } from "@/types/task";
import { ProgressBar } from "@/components/progress/progress-bar";
import { ScheduleStatusBadge } from "@/components/progress/schedule-status";

interface ScheduleAnalysisCardProps {
  project: ProjectWithComputed;
  tasks: Task[];
}

export function ScheduleAnalysisCard({ project, tasks }: ScheduleAnalysisCardProps) {
  const isBehind = project.scheduleStatus === "behind";
  const completedTasksCount = tasks.filter((t) => t.progress === 100 || t.status === "completed").length;

  return (
    <div className="flex flex-col justify-between rounded-[2px] border border-outline-variant/80 bg-surface-container-lowest p-6 lg:p-7 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-outline-variant/40">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-primary text-[20px]">analytics</span>
          <h2 className="text-base font-bold uppercase tracking-wider text-primary font-mono">
            Schedule Analysis
          </h2>
        </div>
        <ScheduleStatusBadge status={project.scheduleStatus} diff={project.scheduleDiff} />
      </div>

      {/* Two-Column Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
        {/* Left Column: Time Progress (Expected) */}
        <div className="flex flex-col gap-3 pr-0 md:pr-6 md:border-r md:border-outline-variant/40">
          <div className="flex items-center justify-between font-mono">
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              Time Progress (Expected)
            </span>
            <span className="text-2xl font-bold text-primary">{project.timeProgress}%</span>
          </div>

          <ProgressBar value={project.timeProgress} color="primary" height="md" />

          <div className="text-[11px] font-mono text-outline-variant flex items-center gap-1.5 mt-1">
            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
            <span>
              {project.daysRemaining < 0 ? 0 : project.daysRemaining} Days Remaining
            </span>
          </div>
        </div>

        {/* Right Column: Work Progress (Actual) */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between font-mono">
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              Work Progress (Actual)
            </span>
            <span className={`text-2xl font-bold ${isBehind ? "text-error-alert" : "text-secondary"}`}>
              {project.progress}%
            </span>
          </div>

          <ProgressBar
            value={project.progress}
            color={isBehind ? "error" : "secondary"}
            height="md"
          />

          <div className="text-[11px] font-mono text-outline-variant flex items-center gap-1.5 mt-1">
            <span className="material-symbols-outlined text-[14px]">task_alt</span>
            <span>
              {completedTasksCount} of {tasks.length} Tasks Completed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
