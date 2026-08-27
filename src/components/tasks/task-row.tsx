"use client";

import React, { useState } from "react";
import { Task } from "@/types/task";
import { ProgressBar } from "@/components/progress/progress-bar";
import { formatDateShort } from "@/lib/utils";

interface TaskRowProps {
  task: Task;
  onUpdate: (taskId: string, data: Partial<Task>) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

export function TaskRow({ task, onUpdate, onDelete }: TaskRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [progress, setProgress] = useState(task.progress);

  const isDelayed = task.endDate && new Date().getTime() > new Date(task.endDate).getTime() && task.progress < 100;
  const isDone = task.progress === 100 || task.status === "completed";

  const handleSave = async () => {
    setIsEditing(false);
    const newStatus = progress === 100 ? "completed" : progress > 0 ? "active" : "pending";
    await onUpdate(task.id, {
      title,
      progress,
      status: newStatus,
    });
  };

  const getStatusBadge = () => {
    if (isDone) {
      return (
        <span className="rounded-[2px] bg-secondary-container px-2 py-0.5 font-mono text-[10px] font-bold text-on-secondary-container">
          Done
        </span>
      );
    }
    if (isDelayed) {
      return (
        <span className="rounded-[2px] bg-error-container px-2 py-0.5 font-mono text-[10px] font-bold text-on-error-container">
          Delayed
        </span>
      );
    }
    if (task.status === "active" || task.progress > 0) {
      return (
        <span className="rounded-[2px] bg-primary-fixed px-2 py-0.5 font-mono text-[10px] font-bold text-on-primary-fixed">
          Active
        </span>
      );
    }
    return (
      <span className="rounded-[2px] bg-surface-variant px-2 py-0.5 font-mono text-[10px] font-bold text-on-surface-variant">
        Pending
      </span>
    );
  };

  return (
    <tr
      className={`border-b border-outline-variant/30 font-mono text-xs transition-colors ${
        isDelayed ? "bg-error-container/10 hover:bg-error-container/20" : "hover:bg-surface-container-low/60"
      }`}
    >
      {/* Task Name & Icon */}
      <td className="py-3.5 px-5">
        <div className="flex items-center gap-2.5">
          <span
            className={`material-symbols-outlined text-[16px] ${
              isDone
                ? "text-secondary"
                : isDelayed
                ? "text-error-alert"
                : task.progress > 0
                ? "text-primary"
                : "text-outline-variant"
            }`}
          >
            {isDone
              ? "check_circle"
              : isDelayed
              ? "error"
              : task.progress > 0
              ? "radio_button_checked"
              : "radio_button_unchecked"}
          </span>

          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-[2px] border border-primary px-2 py-1 font-sans text-xs w-full bg-white"
              autoFocus
            />
          ) : (
            <span
              onClick={() => setIsEditing(true)}
              className="font-sans font-medium text-on-surface hover:text-primary cursor-pointer"
            >
              {task.title}
            </span>
          )}
        </div>
      </td>

      {/* Start Date */}
      <td className="py-3.5 px-5 text-on-surface-variant">
        {formatDateShort(task.startDate)}
      </td>

      {/* Deadline */}
      <td className="py-3.5 px-5">
        <span className={isDelayed ? "text-error-alert font-bold" : "text-on-surface"}>
          {formatDateShort(task.endDate)}
        </span>
      </td>

      {/* Progress Slider / Bar */}
      <td className="py-3.5 px-5 w-48">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full h-1 bg-surface-container-high rounded-lg appearance-none cursor-pointer"
            />
            <span className="font-mono text-xs w-8 text-right font-bold">{progress}%</span>
          </div>
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <ProgressBar
              value={task.progress}
              color={isDone ? "secondary" : isDelayed ? "error" : "primary"}
              height="xs"
            />
            <span className="font-mono text-xs w-8 text-right font-semibold text-on-surface">
              {task.progress}%
            </span>
          </div>
        )}
      </td>

      {/* Status Badge */}
      <td className="py-3.5 px-5">{getStatusBadge()}</td>

      {/* Action Buttons */}
      <td className="py-3.5 px-5 text-right">
        {isEditing ? (
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={handleSave}
              className="rounded-[2px] bg-secondary px-2 py-1 text-[10px] font-bold text-white uppercase"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="rounded-[2px] border border-outline-variant px-2 py-1 text-[10px] font-bold uppercase"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-on-surface-variant hover:text-primary transition-colors"
              title="Edit Task"
            >
              <span className="material-symbols-outlined text-[15px]">edit</span>
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1 text-on-surface-variant hover:text-error-alert transition-colors"
              title="Delete Task"
            >
              <span className="material-symbols-outlined text-[15px]">delete</span>
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
