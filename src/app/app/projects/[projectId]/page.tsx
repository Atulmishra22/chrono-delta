"use client";

import React, { use } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useProject } from "@/hooks/use-project";
import { useTasks } from "@/hooks/use-tasks";
import { createTask, updateTask, deleteTask, updateProject } from "@/lib/firestore";
import { AppLayout } from "@/components/layout/app-layout";
import { CountdownTimer } from "@/components/countdown/countdown-timer";
import { ScheduleAnalysisCard } from "@/components/progress/schedule-analysis-card";
import { TaskTable } from "@/components/tasks/task-table";
import { CreateTaskInput, Task } from "@/types/task";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: Promise<{ projectId: string }>;
}

export default function ProjectDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.projectId;

  const { firebaseUser } = useAuth();
  const { project, loading: projectLoading } = useProject(projectId);
  const { tasks, loading: tasksLoading } = useTasks(projectId);

  const handleAddTask = async (data: CreateTaskInput) => {
    if (!firebaseUser) return;
    await createTask({
      ...data,
      userId: firebaseUser.uid,
    });
  };

  const handleUpdateTask = async (taskId: string, data: Partial<Task>) => {
    await updateTask(taskId, data);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteTask(taskId);
    }
  };

  const handleProgressChange = async (newVal: number) => {
    if (!project) return;
    await updateProject(project.id, { progress: newVal });
  };

  if (projectLoading) {
    return (
      <AppLayout>
        <div className="py-20 text-center font-mono text-xs text-on-surface-variant">
          Initializing telemetry for objective {projectId}...
        </div>
      </AppLayout>
    );
  }

  if (!project) {
    return (
      <AppLayout>
        <div className="rounded-[2px] border border-dashed border-outline-variant p-12 text-center bg-surface-container-lowest">
          <span className="material-symbols-outlined text-4xl text-error-alert mb-2">error</span>
          <h2 className="text-sm font-bold uppercase text-primary font-mono">Objective Not Found</h2>
          <p className="text-xs text-on-surface-variant mt-1">
            This project does not exist or may have been deleted.
          </p>
          <Link
            href="/app/projects"
            className="mt-4 inline-flex items-center gap-1 rounded-[2px] bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-white font-mono"
          >
            &larr; Back to Directory
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-outline-variant/60">
          <div className="flex flex-col gap-1">
            <Link
              href="/app/projects"
              className="flex items-center gap-1 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors font-mono uppercase"
            >
              <span className="material-symbols-outlined text-[14px]">arrow_back</span>
              <span>Back to Directory</span>
            </Link>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-primary">
              {project.title}
            </h1>
            <div className="flex items-center gap-4 text-xs font-mono text-on-surface-variant mt-0.5">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                {formatDate(project.startDate)} &rarr; {formatDate(project.endDate)}
              </span>
              <span className="rounded-[2px] bg-surface-container px-2 py-0.5 font-bold uppercase">
                {project.category}
              </span>
            </div>
          </div>

          {/* Quick Progress Adjuster */}
          <div className="flex items-center gap-3 bg-surface-container-lowest p-3 rounded-[2px] border border-outline-variant">
            <span className="text-[11px] font-mono font-bold uppercase text-on-surface-variant">
              Quick Progress:
            </span>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={project.progress}
              onChange={(e) => handleProgressChange(Number(e.target.value))}
              className="w-32 h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer"
            />
            <span className="font-mono text-xs font-bold text-primary w-8 text-right">
              {project.progress}%
            </span>
          </div>
        </div>

        {/* Bento Row: T-Minus (4 cols) + Schedule Analysis (8 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* T-Minus Countdown Card */}
          <div className="lg:col-span-4 relative flex flex-col justify-between overflow-hidden rounded-[2px] border border-outline-variant/80 bg-surface-container-lowest p-6 lg:p-7 shadow-xs">
            <div className="absolute inset-0 bg-primary/3 pointer-events-none" />
            <div className="flex items-center justify-between pb-5 border-b border-outline-variant/40">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">timer</span>
                <h2 className="text-base font-bold uppercase tracking-wider text-primary font-mono">
                  T-Minus
                </h2>
              </div>
              <span className="rounded-[2px] bg-surface-container px-2 py-0.5 font-mono text-[10px] font-bold text-primary">
                LIVE
              </span>
            </div>

            <div className="py-6">
              <CountdownTimer
                endDate={project.endDate}
                isCompleted={project.progress === 100}
              />
            </div>

            <div className="pt-4 border-t border-outline-variant/40 font-mono text-[11px] text-on-surface-variant flex justify-between">
              <span>EST. COMPLETION</span>
              <span className="font-bold text-primary">{formatDate(project.endDate)}</span>
            </div>
          </div>

          {/* Schedule Analysis Card */}
          <div className="lg:col-span-8">
            <ScheduleAnalysisCard project={project} tasks={tasks} />
          </div>
        </div>

        {/* 12-col Full Execution Pipeline Table */}
        <TaskTable
          projectId={project.id}
          userId={firebaseUser?.uid || ""}
          tasks={tasks}
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
      </div>
    </AppLayout>
  );
}