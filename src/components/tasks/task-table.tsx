"use client";

import React, { useState } from "react";
import { Task, CreateTaskInput } from "@/types/task";
import { TaskRow } from "./task-row";

interface TaskTableProps {
  projectId: string;
  userId: string;
  tasks: Task[];
  onAddTask: (data: CreateTaskInput) => Promise<void>;
  onUpdateTask: (taskId: string, data: Partial<Task>) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
}

export function TaskTable({
  projectId,
  userId,
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}: TaskTableProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDeadline, setNewDeadline] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await onAddTask({
      projectId,
      title: newTitle.trim(),
      endDate: newDeadline ? new Date(newDeadline) : null,
      progress: 0,
    });

    setNewTitle("");
    setNewDeadline("");
    setIsAdding(false);
  };

  return (
    <div className="overflow-hidden rounded-[2px] border border-outline-variant/80 bg-surface-container-lowest shadow-xs">
      {/* Table Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-outline-variant/50 bg-surface-container-lowest">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-primary text-[20px]">checklist</span>
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary font-mono">
            Execution Pipeline
          </h3>
          <span className="rounded-[2px] bg-surface-container px-2 py-0.5 font-mono text-[10px] font-bold text-on-surface-variant">
            {tasks.length} Tasks
          </span>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-1.5 rounded-[2px] bg-primary px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:brightness-110 active:scale-[0.99] transition-all font-mono"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>{isAdding ? "Cancel" : "Add Task"}</span>
        </button>
      </div>

      {/* Add Task Quick Bar */}
      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="flex flex-wrap items-center gap-3 p-4 bg-surface-container-low border-b border-outline-variant/50"
        >
          <input
            type="text"
            placeholder="Task title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 min-w-[200px] rounded-[2px] border border-outline-variant bg-white px-3 py-1.5 text-xs font-sans focus:outline-primary"
            autoFocus
            required
          />
          <input
            type="date"
            value={newDeadline}
            onChange={(e) => setNewDeadline(e.target.value)}
            className="rounded-[2px] border border-outline-variant bg-white px-3 py-1.5 text-xs font-mono focus:outline-primary"
          />
          <button
            type="submit"
            className="rounded-[2px] bg-secondary px-4 py-1.5 text-xs font-bold text-white uppercase font-mono hover:brightness-110"
          >
            Create Task
          </button>
        </form>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-container font-mono text-[11px] font-bold uppercase tracking-wider text-on-surface-variant border-b border-outline-variant/50">
            <tr>
              <th className="py-3 px-5">Task Name</th>
              <th className="py-3 px-5">Start</th>
              <th className="py-3 px-5">Deadline</th>
              <th className="py-3 px-5 w-48">Progress</th>
              <th className="py-3 px-5">Status</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30">
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-on-surface-variant font-mono">
                  No tasks in the execution pipeline. Click Add Task to begin.
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onUpdate={onUpdateTask}
                  onDelete={onDeleteTask}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
