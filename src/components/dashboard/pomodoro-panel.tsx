"use client";

import React, { useState, useEffect } from "react";

export function PomodoroPanel() {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(25 * 60);
  };

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs = String(secondsLeft % 60).padStart(2, "0");
  const progress = ((25 * 60 - secondsLeft) / (25 * 60)) * 100;

  return (
    <div className="flex flex-col justify-between rounded-[2px] border border-outline-variant/80 bg-surface-container-lowest p-6 shadow-xs h-full">
      <div className="flex items-center justify-between pb-4 border-b border-outline-variant/40">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-primary">timer</span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary font-mono">
            Current Block (Pomodoro)
          </span>
        </div>
        <span className="h-2 w-2 rounded-full bg-secondary" />
      </div>

      {/* Timer Circle */}
      <div className="my-6 flex flex-col items-center justify-center">
        <div className="relative flex h-36 w-36 items-center justify-center">
          <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
            <circle
              className="text-surface-container-high"
              strokeWidth="6"
              stroke="currentColor"
              fill="transparent"
              r="42"
              cx="50"
              cy="50"
            />
            <circle
              className="text-primary transition-all duration-300 ease-linear"
              strokeWidth="6"
              strokeDasharray={264}
              strokeDashoffset={264 - (264 * progress) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="42"
              cx="50"
              cy="50"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="font-mono text-2xl font-bold tracking-tight text-primary">
              {mins}:{secs}
            </span>
            <span className="text-[9px] font-bold tracking-widest text-on-surface-variant uppercase">
              Focus
            </span>
          </div>
        </div>
      </div>

      {/* Timer Action Controls */}
      <div className="flex gap-2">
        <button
          onClick={toggleTimer}
          className="flex-1 rounded-[2px] bg-primary py-2 text-xs font-bold uppercase tracking-wider text-white hover:brightness-110 transition-all flex items-center justify-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">
            {isActive ? "pause" : "play_arrow"}
          </span>
          {isActive ? "Pause" : "Start"}
        </button>
        <button
          onClick={resetTimer}
          className="rounded-[2px] border border-outline-variant bg-surface-container px-3 py-2 text-xs font-bold text-on-surface hover:bg-surface-container-high transition-colors"
          title="Reset"
        >
          <span className="material-symbols-outlined text-[16px]">restart_alt</span>
        </button>
      </div>
    </div>
  );
}
