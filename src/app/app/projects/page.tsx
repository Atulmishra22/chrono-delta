"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useProjects } from "@/hooks/use-projects";
import { deleteProject } from "@/lib/firestore";
import { AppLayout } from "@/components/layout/app-layout";
import { ProjectCard } from "@/components/projects/project-card";

type TabFilter = "all" | "active" | "completed" | "archived";

export default function ProjectsPage() {
  const { firebaseUser } = useAuth();
  const { projects, loading } = useProjects(firebaseUser?.uid);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<TabFilter>("all");

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;
    if (filter === "all") return true;
    return p.status === filter;
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this project and all its tasks?")) {
      await deleteProject(id);
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-outline-variant/60">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-primary">
              Projects Directory
            </h1>
            <p className="text-xs lg:text-sm text-on-surface-variant mt-0.5">
              Manage objectives, track time variance, and adjust constraints.
            </p>
          </div>

          <Link
            href="/app/projects/new"
            className="flex items-center gap-1.5 rounded-[2px] bg-primary px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:brightness-110 active:scale-[0.99] transition-all font-mono"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>New Project</span>
          </Link>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search projects by title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-[2px] border border-outline-variant bg-surface-container-lowest pl-9 pr-4 py-2 text-xs font-sans focus:outline-primary"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center border border-outline-variant rounded-[2px] bg-surface-container overflow-hidden font-mono text-xs">
            {(["all", "active", "completed", "archived"] as TabFilter[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3.5 py-1.5 font-bold uppercase transition-colors ${
                  filter === tab
                    ? "bg-primary text-white"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="py-20 text-center font-mono text-xs text-on-surface-variant">
            Scanning project telemetry...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="rounded-[2px] border border-dashed border-outline-variant p-12 text-center bg-surface-container-lowest">
            <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">folder_off</span>
            <h3 className="text-sm font-bold uppercase text-primary font-mono">No Projects Found</h3>
            <p className="text-xs text-on-surface-variant mt-1">
              {search ? "No projects match your search query." : "You have no projects under this category."}
            </p>
            <Link
              href="/app/projects/new"
              className="mt-4 inline-flex items-center gap-1.5 rounded-[2px] bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:brightness-110 font-mono"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              Create Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
