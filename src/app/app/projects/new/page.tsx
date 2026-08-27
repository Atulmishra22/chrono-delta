"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { createProject } from "@/lib/firestore";
import { AppLayout } from "@/components/layout/app-layout";
import { ProjectCategory } from "@/types/project";

export default function NewProjectPage() {
  const { firebaseUser } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0]
  );
  const [progress, setProgress] = useState(0);
  const [category, setCategory] = useState<ProjectCategory>("Work");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser) return;
    if (!title.trim()) {
      setError("Please provide a project name.");
      return;
    }
    if (new Date(endDate).getTime() <= new Date(startDate).getTime()) {
      setError("The deadline must be strictly after the start date.");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const pId = await createProject({
        userId: firebaseUser.uid,
        title: title.trim(),
        description: description.trim(),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        progress,
        category,
      });
      router.push(`/app/projects/${pId}`);
    } catch (err: any) {
      setError(err?.message || "Failed to create project.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3 pb-6 border-b border-outline-variant/60">
          <Link
            href="/app/projects"
            className="flex h-8 w-8 items-center justify-center rounded-[2px] border border-outline-variant hover:bg-surface-container text-primary"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-primary font-mono uppercase">
              Create New Objective
            </h1>
            <p className="text-xs text-on-surface-variant">
              Establish temporal constraints and progress baseline.
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-[2px] bg-error-container border border-error-alert/30 p-3 text-xs font-mono text-on-error-container">
            {error}
          </div>
        )}

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-[2px] border border-outline-variant bg-surface-container-lowest p-7 flex flex-col gap-5 shadow-xs"
        >
          {/* Title */}
          <div className="flex flex-col gap-1.5 font-mono text-xs">
            <label className="font-bold uppercase text-on-surface-variant text-[11px]">
              Project Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Build AI Portfolio"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-[2px] border border-outline-variant bg-white p-2.5 font-sans focus:outline-primary"
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5 font-mono text-xs">
            <label className="font-bold uppercase text-on-surface-variant text-[11px]">
              Description (Optional)
            </label>
            <textarea
              placeholder="Brief summary of requirements and target output..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="rounded-[2px] border border-outline-variant bg-white p-2.5 font-sans focus:outline-primary resize-none"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold uppercase text-on-surface-variant text-[11px]">
                Start Date *
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-[2px] border border-outline-variant bg-white p-2.5 focus:outline-primary"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-bold uppercase text-on-surface-variant text-[11px]">
                Deadline *
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-[2px] border border-outline-variant bg-white p-2.5 focus:outline-primary"
                required
              />
            </div>
          </div>

          {/* Progress Slider */}
          <div className="flex flex-col gap-2 font-mono text-xs">
            <div className="flex justify-between items-center">
              <label className="font-bold uppercase text-on-surface-variant text-[11px]">
                Initial Work Completed
              </label>
              <span className="font-bold text-primary">{progress}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5 font-mono text-xs">
            <label className="font-bold uppercase text-on-surface-variant text-[11px]">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProjectCategory)}
              className="rounded-[2px] border border-outline-variant bg-white p-2.5 focus:outline-primary"
            >
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Study">Study</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-outline-variant/40">
            <Link
              href="/app/projects"
              className="rounded-[2px] border border-outline-variant px-4 py-2 text-xs font-bold uppercase text-on-surface-variant font-mono hover:bg-surface-container"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-[2px] bg-primary px-6 py-2 text-xs font-bold uppercase tracking-wider text-white hover:brightness-110 font-mono disabled:opacity-50"
            >
              <span>{submitting ? "Deploying..." : "Create Objective"}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
