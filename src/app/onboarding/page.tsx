"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { createProject, createTask, updateUserOnboarding } from "@/lib/firestore";
import { CountdownTimer } from "@/components/countdown/countdown-timer";

export default function OnboardingPage() {
  const { firebaseUser, userProfile, loading, refreshProfile } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [projectName, setProjectName] = useState("Build AI Portfolio");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0]
  );
  const [category, setCategory] = useState<"Personal" | "Work" | "Study" | "Other">("Work");
  const [tasks, setTasks] = useState<string[]>([
    "Define System Architecture",
    "Implement Core UI Components",
    "Connect Firestore Backend",
    "Deploy to Production",
  ]);
  const [createdProjectId, setCreatedProjectId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.push("/login");
    }
  }, [firebaseUser, loading, router]);

  const handleAddTaskInput = () => {
    setTasks([...tasks, ""]);
  };

  const handleTaskChange = (index: number, val: string) => {
    const updated = [...tasks];
    updated[index] = val;
    setTasks(updated);
  };

  const handleRemoveTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleCreateProjectAndTasks = async () => {
    if (!firebaseUser) return;
    setSaving(true);
    try {
      const pId = await createProject({
        userId: firebaseUser.uid,
        title: projectName,
        startDate: new Date(startDate),
        endDate: new Date(deadline),
        progress: 0,
        category,
      });
      setCreatedProjectId(pId);

      // Create each task
      for (const t of tasks) {
        if (t.trim()) {
          await createTask({
            userId: firebaseUser.uid,
            projectId: pId,
            title: t.trim(),
            startDate: new Date(startDate),
            endDate: new Date(deadline),
            progress: 0,
          });
        }
      }

      setStep(4);
    } catch (err) {
      console.error("Failed to complete onboarding setup:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleFinish = async () => {
    if (!firebaseUser) return;
    setSaving(true);
    try {
      await updateUserOnboarding(firebaseUser.uid, true);
      await refreshProfile();
      router.push("/app/dashboard");
    } catch (err) {
      console.error("Failed to update onboarding status:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-3 sm:p-8">
      <div className="w-full max-w-xl rounded-[2px] border border-outline-variant bg-surface-container-lowest p-5 sm:p-8 shadow-sm">
        {/* Step Indicator */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-outline-variant/40 font-mono text-xs text-on-surface-variant">
          <span className="font-bold text-primary">INITIAL SETUP PROTOCOL</span>
          <span>STEP 0{step} / 04</span>
        </div>

        {/* STEP 1: WELCOME */}
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold text-primary tracking-tight">
                Welcome to ChronoDelta, {firebaseUser?.displayName || "Operator"}.
              </h2>
              <p className="mt-2 text-xs text-on-surface-variant leading-relaxed">
                ChronoDelta provides real-time mathematical schedule intelligence. In the next 60 seconds,
                we will configure your primary project constraint and set up your initial execution pipeline.
              </p>
            </div>

            <div className="rounded-[2px] bg-surface-container-low p-4 border border-outline-variant/40 flex items-start gap-3">
              <span className="material-symbols-outlined text-secondary text-xl mt-0.5">verified</span>
              <div className="text-xs text-on-surface">
                <span className="font-bold">Automated Schedule Calculus:</span> Every task progress update
                is immediately subtracted from total elapsed time to pinpoint delays before they compound.
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="flex items-center justify-center gap-2 rounded-[2px] bg-primary py-3 text-xs font-bold uppercase tracking-wider text-white hover:brightness-110 font-mono"
            >
              <span>Begin Initialization</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        )}

        {/* STEP 2: CREATE PROJECT */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-xl font-bold text-primary font-mono uppercase">
                Step 02: Define First Objective
              </h2>
              <p className="text-xs text-on-surface-variant mt-1">
                Enter the name and time boundaries for your target deliverable.
              </p>
            </div>

            <div className="flex flex-col gap-4 font-mono text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold uppercase text-on-surface-variant text-[11px]">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="rounded-[2px] border border-outline-variant bg-white p-2.5 font-sans focus:outline-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold uppercase text-on-surface-variant text-[11px]">
                    Start Date
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
                    Hard Deadline *
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="rounded-[2px] border border-outline-variant bg-white p-2.5 focus:outline-primary"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold uppercase text-on-surface-variant text-[11px]">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="rounded-[2px] border border-outline-variant bg-white p-2.5 focus:outline-primary"
                >
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Study">Study</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-outline-variant/40">
              <button
                onClick={() => setStep(1)}
                className="rounded-[2px] border border-outline-variant px-4 py-2 text-xs font-bold uppercase text-on-surface-variant font-mono"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!projectName.trim() || !deadline}
                className="flex items-center gap-2 rounded-[2px] bg-primary px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:brightness-110 font-mono disabled:opacity-50"
              >
                <span>Continue</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ADD INITIAL TASKS */}
        {step === 3 && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-xl font-bold text-primary font-mono uppercase">
                Step 03: Execution Pipeline
              </h2>
              <p className="text-xs text-on-surface-variant mt-1">
                Add initial milestones to track work progress for {projectName}.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {tasks.map((task, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-primary-fixed-dim w-6">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <input
                    type="text"
                    value={task}
                    onChange={(e) => handleTaskChange(idx, e.target.value)}
                    placeholder={`Task ${idx + 1}...`}
                    className="flex-1 rounded-[2px] border border-outline-variant bg-white p-2 text-xs font-sans focus:outline-primary"
                  />
                  {tasks.length > 1 && (
                    <button
                      onClick={() => handleRemoveTask(idx)}
                      className="p-1 text-outline-variant hover:text-error-alert"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  )}
                </div>
              ))}

              <button
                onClick={handleAddTaskInput}
                className="mt-1 flex items-center gap-1 text-xs font-bold text-secondary font-mono hover:underline w-fit"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Add Another Milestone</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-outline-variant/40">
              <button
                onClick={() => setStep(2)}
                className="rounded-[2px] border border-outline-variant px-4 py-2 text-xs font-bold uppercase text-on-surface-variant font-mono"
              >
                Back
              </button>
              <button
                onClick={handleCreateProjectAndTasks}
                disabled={saving}
                className="flex items-center gap-2 rounded-[2px] bg-secondary px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:brightness-110 font-mono disabled:opacity-50"
              >
                <span>{saving ? "Saving..." : "Assemble Objective"}</span>
                <span className="material-symbols-outlined text-[16px]">check</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: COMPLETION PREVIEW */}
        {step === 4 && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-white">
                <span className="material-symbols-outlined text-2xl">verified</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-primary font-mono uppercase">
                  SYSTEM READY
                </h2>
                <p className="text-xs text-on-surface-variant">
                  Initial constraints active and synchronized with live clock.
                </p>
              </div>
            </div>

            {/* Countdown Preview */}
            <div className="rounded-[2px] border border-outline-variant/80 bg-surface-container-low p-6">
              <div className="text-[11px] font-mono font-bold uppercase text-on-surface-variant mb-2">
                Live T-Minus Countdown: {projectName}
              </div>
              <CountdownTimer endDate={new Date(deadline)} />
            </div>

            <button
              onClick={handleFinish}
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-[2px] bg-primary py-3 text-xs font-bold uppercase tracking-wider text-white hover:brightness-110 font-mono disabled:opacity-50"
            >
              <span>Enter Command Center Dashboard</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
