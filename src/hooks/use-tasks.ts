"use client";

import { useEffect, useState } from "react";
import { subscribeToProjectTasks } from "@/lib/firestore";
import { Task } from "@/types/task";

export function useTasks(projectId: string | null | undefined) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) {
      setTasks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = subscribeToProjectTasks(projectId, (rawTasks) => {
      setTasks(rawTasks);
      setLoading(false);
    });
    return () => unsub();
  }, [projectId]);

  return { tasks, loading };
}
