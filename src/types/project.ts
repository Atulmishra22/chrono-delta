export type ProjectStatus = "active" | "completed" | "archived";
export type ProjectCategory = "Personal" | "Work" | "Study" | "Other";
export type ScheduleStatus = "ahead" | "on-track" | "behind";

export interface Project {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  progress: number; // 0-100, user controlled work %
  category: ProjectCategory;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectComputed {
  timeProgress: number; // 0-100
  scheduleDiff: number; // positive = ahead, negative = behind
  scheduleStatus: ScheduleStatus;
  daysRemaining: number;
  isOverdue: boolean;
}

export type ProjectWithComputed = Project & ProjectComputed;

export interface CreateProjectInput {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  category: ProjectCategory;
}
