export type TaskStatus = "pending" | "active" | "completed";

export interface Task {
  id: string;
  userId: string;
  projectId: string;
  title: string;
  startDate: Date | null;
  endDate: Date | null;
  progress: number; // 0-100
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskInput {
  projectId: string;
  title: string;
  startDate?: Date | null;
  endDate?: Date | null;
  progress?: number;
}
