"use client";

import { useEffect, useState } from "react";
import { subscribeToUserProjects } from "@/lib/firestore";
import { computeProjectMetrics } from "@/lib/calculations";
import { ProjectWithComputed } from "@/types/project";

export function useProjects(userId: string | null | undefined) {
  const [projects, setProjects] = useState<ProjectWithComputed[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setProjects([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = subscribeToUserProjects(userId, (rawProjects) => {
      const computed = rawProjects.map((p) => ({
        ...p,
        ...computeProjectMetrics(p),
      }));
      setProjects(computed);
      setLoading(false);
    });
    return () => unsub();
  }, [userId]);

  return { projects, loading };
}
