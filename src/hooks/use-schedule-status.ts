"use client";

import { useEffect, useState } from "react";
import { Project, ProjectComputed } from "@/types/project";
import { computeProjectMetrics } from "@/lib/calculations";

export function useScheduleStatus(project: Project | null | undefined) {
  const [metrics, setMetrics] = useState<ProjectComputed | null>(() =>
    project ? computeProjectMetrics(project) : null
  );

  useEffect(() => {
    if (!project) {
      setMetrics(null);
      return;
    }
    const update = () => setMetrics(computeProjectMetrics(project));
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [project]);

  return metrics;
}
