"use client";

import React, { useEffect, useState } from "react";
import { getGreeting } from "@/lib/utils";

interface HeaderProps {
  criticalAlertsCount?: number;
}

export function Header({ criticalAlertsCount = 0 }: HeaderProps) {
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex items-center justify-between pb-6 border-b border-outline-variant/60">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-primary">
          {getGreeting()}.
        </h1>
        <p className="text-xs lg:text-sm text-on-surface-variant mt-0.5">
          System status nominal.{" "}
          {criticalAlertsCount > 0 ? (
            <span className="font-semibold text-error-alert">
              {criticalAlertsCount} critical alert{criticalAlertsCount > 1 ? "s" : ""} pending.
            </span>
          ) : (
            <span className="text-secondary font-semibold">All operations running on schedule.</span>
          )}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-[2px] border border-outline-variant bg-surface-container px-3 py-1 font-mono text-xs font-semibold text-primary tracking-wider">
          <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
          <span>{timeStr || "--:--:--"}</span>
        </div>
      </div>
    </header>
  );
}
