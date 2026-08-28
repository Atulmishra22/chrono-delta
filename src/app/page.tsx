import React from "react";
import Link from "next/link";
import { ProgressBar } from "@/components/progress/progress-bar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-outline-variant/60 bg-white/95 px-4 sm:px-6 lg:px-12 backdrop-blur-xs">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-sm bg-primary text-white font-mono font-bold text-sm sm:text-base">
            CD
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tight text-primary">ChronoDelta</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 font-mono text-xs font-bold uppercase tracking-widest text-on-surface-variant">
          <a href="#problem" className="hover:text-primary transition-colors">Problem</a>
          <a href="#protocol" className="hover:text-primary transition-colors">Protocol</a>
          <a href="#intelligence" className="hover:text-primary transition-colors">Intelligence</a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="rounded-[2px] px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs font-bold uppercase tracking-wider text-primary hover:bg-surface-container transition-colors font-mono"
          >
            Login
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-1 rounded-[2px] bg-primary px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold uppercase tracking-wider text-white hover:brightness-110 active:scale-[0.99] transition-all font-mono"
          >
            <span>Get Started</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </Link>
        </div>
      </header>

      {/* Hero Section with HUD Card */}
      <section className="relative overflow-hidden border-b border-outline-variant/60 py-10 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-[1400px] grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 rounded-[2px] border border-outline-variant/80 bg-surface-container px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest text-primary w-fit">
              <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
              <span>SYSTEM ONLINE V2.4</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary leading-[1.08]">
              See where your time is going.
            </h1>

            <p className="text-base lg:text-lg text-on-surface-variant max-w-xl leading-relaxed">
              Standard task managers tell you what to do. ChronoDelta calculates mathematical variance
              between elapsed time and actual work completed to alert you before deadlines fail.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-[2px] bg-primary px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:brightness-110 active:scale-[0.99] transition-all font-mono shadow-sm"
              >
                <span>Initialize Platform</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
              <a
                href="#protocol"
                className="rounded-[2px] border border-outline-variant px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-primary hover:bg-surface-container transition-colors font-mono"
              >
                View Protocol Sequence
              </a>
            </div>
          </div>

          {/* Right Column: Interactive HUD Preview Card */}
          <div className="lg:col-span-6">
            <div className="rounded-[2px] border border-outline-variant bg-surface-container-lowest shadow-md overflow-hidden">
              {/* HUD Header */}
              <div className="flex items-center justify-between bg-primary p-4 text-white">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-secondary-fixed">
                    radar
                  </span>
                  <span className="font-mono text-xs font-bold tracking-wider uppercase">
                    PROJECT: ALPHA MIGRATION
                  </span>
                </div>
                <span className="rounded-[2px] bg-error-container px-2 py-0.5 font-mono text-[10px] font-bold text-on-error-container">
                  CRITICAL VARIANCE
                </span>
              </div>

              {/* HUD Body */}
              <div className="p-6 flex flex-col gap-6">
                {/* Time Elapsed */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-baseline font-mono text-xs">
                    <span className="text-on-surface-variant font-bold uppercase">Time Elapsed</span>
                    <span className="text-2xl font-bold text-surface-tint">75%</span>
                  </div>
                  <ProgressBar value={75} color="surface-tint" height="lg" />
                </div>

                {/* Work Completed */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-baseline font-mono text-xs">
                    <span className="text-error-alert font-bold uppercase">
                      Work Completed (Behind Schedule)
                    </span>
                    <span className="text-2xl font-bold text-error-alert">42%</span>
                  </div>
                  <ProgressBar value={42} color="error" height="lg" />
                </div>

                {/* HUD Live Delta Footer */}
                <div className="rounded-[2px] bg-error-container/20 border border-error-alert/30 p-3.5 flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center gap-2 text-error-alert font-bold">
                    <span className="material-symbols-outlined text-[18px]">warning</span>
                    <span>NEGATIVE DELTA: -33%</span>
                  </div>
                  <span className="text-on-surface-variant font-semibold">12 Days Remaining</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Comparison Section */}
      <section id="problem" className="py-10 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-12 bg-surface-container-low border-b border-outline-variant/60">
        <div className="mx-auto max-w-[1200px]">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
            <div className="text-xs font-bold uppercase tracking-widest text-secondary font-mono mb-2">
              The Fundamental Flaw
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-primary">
              Stop guessing. Start knowing.
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-3">
              Traditional productivity tools track tasks in isolation without measuring their velocity
              against non-negotiable time limits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Standard Trackers */}
            <div className="rounded-[2px] border border-outline-variant/60 bg-white p-6 sm:p-8 opacity-80">
              <div className="flex items-center gap-2 text-outline-variant font-mono text-xs font-bold uppercase mb-4">
                <span className="material-symbols-outlined text-lg">close</span>
                <span>Standard Trackers</span>
              </div>
              <ul className="space-y-4 text-xs text-on-surface-variant">
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-error-alert text-base mt-0.5">close</span>
                  <span>Tasks are binary checkmarks with no time context.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-error-alert text-base mt-0.5">close</span>
                  <span>Deadlines approach as sudden surprises rather than calculated trajectories.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-error-alert text-base mt-0.5">close</span>
                  <span>No warning when 80% of time has elapsed but only 30% of work is finished.</span>
                </li>
              </ul>
            </div>

            {/* ChronoDelta Architecture */}
            <div className="rounded-[2px] border-2 border-primary bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 text-secondary font-mono text-xs font-bold uppercase mb-4">
                <span className="material-symbols-outlined text-lg">check_circle</span>
                <span>ChronoDelta Intelligence</span>
              </div>
              <ul className="space-y-4 text-xs text-on-surface">
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-secondary text-base mt-0.5">check</span>
                  <span className="font-medium">Continuous mathematical comparison: Work% minus Time%.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-secondary text-base mt-0.5">check</span>
                  <span className="font-medium">Live T-Minus countdown clock updated second-by-second.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-secondary text-base mt-0.5">check</span>
                  <span className="font-medium">Surgical Active Radar table flags delayed tasks instantly.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Protocol Sequence (3 Steps) */}
      <section id="protocol" className="py-10 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-12 border-b border-outline-variant/60">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-16 gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-secondary font-mono mb-2">
                PROTOCOL SEQUENCE
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-primary">
                Three steps to command.
              </h2>
            </div>
            <p className="text-xs text-on-surface-variant max-w-sm font-mono">
              Designed for developers, founders, and engineers managing tight project delivery timelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-[2px] border border-outline-variant bg-surface-container-lowest p-5 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary text-white font-mono font-bold text-sm mb-6">
                  01
                </div>
                <h3 className="text-base font-bold text-primary font-mono uppercase">Define Constraints</h3>
                <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                  Establish the start timestamp and hard deadline date for your project and major milestones.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-outline-variant/30 font-mono text-[10px] font-bold text-on-surface-variant uppercase">
                INPUT: T-START, T-END
              </div>
            </div>

            <div className="rounded-[2px] border border-outline-variant bg-surface-container-lowest p-5 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary text-white font-mono font-bold text-sm mb-6">
                  02
                </div>
                <h3 className="text-base font-bold text-primary font-mono uppercase">Log Progress Velocity</h3>
                <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                  Update work completion percentages across execution pipeline tasks with single-click precision.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-outline-variant/30 font-mono text-[10px] font-bold text-on-surface-variant uppercase">
                INPUT: W-COMPLETED %
              </div>
            </div>

            <div className="rounded-[2px] border border-outline-variant bg-surface-container-lowest p-5 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-secondary text-white font-mono font-bold text-sm mb-6">
                  03
                </div>
                <h3 className="text-base font-bold text-primary font-mono uppercase">Analyze Delta</h3>
                <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                  ChronoDelta instantly surfaces schedule variance to tell you if you are Ahead, On Track, or Behind.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-outline-variant/30 font-mono text-[10px] font-bold text-secondary uppercase">
                OUTPUT: SCHEDULE DELTA
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 sm:px-6 lg:px-12 bg-white flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-on-surface-variant border-t border-outline-variant/40">
        <div className="flex items-center gap-2">
          <span className="font-bold text-primary">ChronoDelta Intelligence</span>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          <span className="hidden sm:inline">PRECISION TIME INSTRUMENT</span>
          <Link href="/login" className="text-primary hover:underline font-bold">
            COMMAND CENTER &rarr;
          </Link>
        </div>
      </footer>
    </div>
  );
}
