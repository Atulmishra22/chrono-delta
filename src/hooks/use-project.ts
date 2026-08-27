"use client";

import { useEffect, useState } from "react";
import { subscribeToSingleProject } from "@/lib/firestore";
import { computeProjectMetrics } from "@/lib/calculations";
import { ProjectWithComputed } from "@/types/project";

export function useProject(projectId: string | null | undefined) {
  const [project, setProject] = useState<ProjectWithComputed | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) {
      setProject(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = subscribeToSingleProject(projectId, (rawProject) => {
      if (rawProject) {
        setProject({
          ...rawProject,
          ...computeProjectMetrics(rawProject),
        });
      } else {
        setProject(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [projectId]);

  return { project, loading };
}
