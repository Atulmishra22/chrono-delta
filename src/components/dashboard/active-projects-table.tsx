"use client";

import React from "react";
import Link from "next/link";
import { ProjectWithComputed } from "@/types/project";
import { ProgressBar } from "@/components/progress/progress-bar";
import { ScheduleStatusBadge } from "@/components/progress/schedule-status";
import { formatDate } from "@/lib/utils";

interface ActiveProjectsTableProps {
  projects: ProjectWithComputed[];
}

export function ActiveProjectsTable({ projects }: ActiveProjectsTableProps) {
  const activeProjects = projects.filter((p) => p.status === "active");

  return (
    <div className="overflow-hidden rounded-[2px] border border-outline-variant/80 bg-surface-container-lowest shadow-xs">
      {/* Table Header Row */}
      <div className="flex items-center justify-between p-5 border-b border-outline-variant/50 bg-surface-container-lowest">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-primary text-[20px]">radar</span>
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary font-mono">
            Active Radar
          </h3>
          <span className="rounded-[2px] bg-surface-container px-2 py-0.5 font-mono text-[10px] font-bold text-on-surface-variant">
            {activeProjects.length} Projects
          </span>
        </div>

        <Link
          href="/app/projects"
          className="text-xs font-bold uppercase tracking-wider text-primary hover:text-secondary transition-colors font-mono flex items-center gap-1"
        >
          <span>View All</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </Link>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-container font-mono text-[11px] font-bold uppercase tracking-wider text-on-surface-variant border-b border-outline-variant/50">
            <tr>
              <th className="py-3 px-5">Project Name</th>
              <th className="py-3 px-5">Status</th>
              <th className="py-3 px-5 w-48">Work Progress</th>
              <th className="py-3 px-5">Deadline</th>
              <th className="py-3 px-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30 font-mono">
            {activeProjects.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-on-surface-variant">
                  No active projects found. Click New Project to create one.
                </td>
              </tr>
            ) : (
              activeProjects.map((project) => {
                const isOverdue = project.isOverdue;
                return (
                  <tr
                    key={project.id}
                    className="hover:bg-surface-container-low/60 transition-colors"
                  >
                    <td className="py-3.5 px-5">
                      <Link
                        href={`/app/projects/${project.id}`}
                        className="font-sans font-semibold text-primary hover:underline flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[16px] text-outline-variant">
                          folder
                        </span>
                        {project.title}
                      </Link>
                      {project.description && (
                        <div className="font-sans text-[11px] text-on-surface-variant truncate max-w-xs mt-0.5">
                          {project.description}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-5">
                      <ScheduleStatusBadge
                        status={project.scheduleStatus}
                        diff={project.scheduleDiff}
                        variant="dot"
                      />
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <ProgressBar
                          value={project.progress}
                          color={project.scheduleStatus === "behind" ? "error" : "secondary"}
                          height="sm"
                        />
                        <span className="font-bold text-on-surface w-8 text-right">
                          {project.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className={isOverdue ? "text-error-alert font-bold" : "text-on-surface"}>
                        {formatDate(project.endDate)}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <Link
                        href={`/app/projects/${project.id}`}
                        className="inline-flex items-center justify-center h-7 w-7 rounded-[2px] border border-outline-variant hover:bg-surface-container text-primary transition-colors"
                        title="Open Details"
                      >
                        <span className="material-symbols-outlined text-[14px]">more_horiz</span>
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
