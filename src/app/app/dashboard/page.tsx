"use client";

import React from "react";
import { useAuth } from "@/contexts/auth-context";
import { useProjects } from "@/hooks/use-projects";
import { getMainFocusProject } from "@/lib/calculations";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { KPICards } from "@/components/dashboard/kpi-cards";
import { MainFocus } from "@/components/dashboard/main-focus";
import { PomodoroPanel } from "@/components/dashboard/pomodoro-panel";
import { ActiveProjectsTable } from "@/components/dashboard/active-projects-table";

export default function DashboardPage() {
  const { firebaseUser } = useAuth();
  const { projects, loading } = useProjects(firebaseUser?.uid);

  const mainFocusProject = getMainFocusProject(projects);
  const criticalCount = projects.filter(
    (p) => p.status === "active" && p.scheduleStatus === "behind"
  ).length;

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <Header criticalAlertsCount={criticalCount} />

        {/* 4 KPI Summary Cards */}
        <KPICards projects={projects} />

        {/* Bento Row: Main Focus (8 cols) + Pomodoro Timer (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-8">
            <MainFocus project={mainFocusProject} />
          </div>
          <div className="lg:col-span-4">
            <PomodoroPanel />
          </div>
        </div>

        {/* 12-col Full-Width Active Radar Table */}
        <ActiveProjectsTable projects={projects} />
      </div>
    </AppLayout>
  );
}
