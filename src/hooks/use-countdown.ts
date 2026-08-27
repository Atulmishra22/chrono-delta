"use client";

import { useEffect, useState } from "react";
import { getTimeRemaining } from "@/lib/calculations";

export function useCountdown(endDate: Date | null | undefined) {
  const [time, setTime] = useState(() => (endDate ? getTimeRemaining(new Date(endDate)) : null));

  useEffect(() => {
    if (!endDate) {
      setTime(null);
      return;
    }
    const target = new Date(endDate);
    setTime(getTimeRemaining(target));

    const interval = setInterval(() => {
      setTime(getTimeRemaining(target));
    }, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  return time;
}
