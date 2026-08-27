import { Project, ProjectComputed, ProjectWithComputed, ScheduleStatus } from "@/types/project";

export function getTimeProgress(startDate: Date | string, endDate: Date | string): number {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const now = new Date().getTime();
  if (isNaN(start) || isNaN(end)) return 0;
  const total = end - start;
  if (total <= 0) return 100;
  const elapsed = now - start;
  if (elapsed <= 0) return 0;
  if (elapsed >= total) return 100;
  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
}

export function getScheduleDiff(workProgress: number = 0, timeProgress: number = 0): number {
  return Math.round((workProgress || 0) - (timeProgress || 0));
}

export function getScheduleStatus(diff: number = 0): ScheduleStatus {
  if (diff >= 10) return "ahead";
  if (diff <= -10) return "behind";
  return "on-track";
}

export function getTimeRemaining(endDate: Date | string): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isOverdue: boolean;
  totalMs: number;
} {
  if (!endDate) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isOverdue: false, totalMs: 0 };
  }
  const now = new Date().getTime();
  const end = new Date(endDate).getTime();
  if (isNaN(end)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isOverdue: false, totalMs: 0 };
  }
  const diff = end - now;

  if (diff <= 0) {
    const overdue = Math.abs(diff);
    return {
      days: Math.floor(overdue / 86400000),
      hours: Math.floor((overdue % 86400000) / 3600000),
      minutes: Math.floor((overdue % 3600000) / 60000),
      seconds: Math.floor((overdue % 60000) / 1000),
      isOverdue: true,
      totalMs: diff,
    };
  }

  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    isOverdue: false,
    totalMs: diff,
  };
}

export function getDaysRemaining(endDate: Date | string): number {
  if (!endDate) return 0;
  const now = new Date().getTime();
  const end = new Date(endDate).getTime();
  if (isNaN(end)) return 0;
  const diff = end - now;
  return Math.ceil(diff / 86400000);
}

export function computeProjectMetrics(project: Project): ProjectComputed {
  const timeProgress = getTimeProgress(project.startDate, project.endDate);
  const scheduleDiff = getScheduleDiff(project.progress, timeProgress);
  const scheduleStatus = getScheduleStatus(scheduleDiff);
  const daysRemaining = getDaysRemaining(project.endDate);
  const isOverdue = daysRemaining < 0 && project.progress < 100;
  return { timeProgress, scheduleDiff, scheduleStatus, daysRemaining, isOverdue };
}

export function getMainFocusProject(projects: ProjectWithComputed[]): ProjectWithComputed | null {
  const active = projects.filter((p) => p.status === "active");
  if (active.length === 0) return null;

  // 1. Overdue projects (highest priority)
  const overdue = active.filter((p) => p.isOverdue);
  if (overdue.length > 0) {
    return overdue.sort((a, b) => a.daysRemaining - b.daysRemaining)[0];
  }

  // 2. Behind schedule (biggest negative delta)
  const behind = active.filter((p) => p.scheduleStatus === "behind");
  if (behind.length > 0) {
    return behind.sort((a, b) => a.scheduleDiff - b.scheduleDiff)[0];
  }

  // 3. Closest deadline
  return active.sort((a, b) => a.daysRemaining - b.daysRemaining)[0];
}
