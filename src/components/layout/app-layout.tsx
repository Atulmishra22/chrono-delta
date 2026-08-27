"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Sidebar } from "@/components/layout/sidebar";

import { useUIStore } from "@/stores/ui-store";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { firebaseUser, userProfile, loading } = useAuth();
  const { toggleSidebar } = useUIStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!firebaseUser) {
        router.push("/login");
      } else if (userProfile && !userProfile.onboardingCompleted) {
        router.push("/onboarding");
      }
    }
  }, [firebaseUser, userProfile, loading, router]);

  if (loading || !firebaseUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-xs font-mono font-bold tracking-widest text-primary uppercase">
            Loading Command Center...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* Mobile Top Navigation Header */}
      <div className="lg:hidden sticky top-0 z-30 flex h-14 items-center justify-between border-b border-outline-variant bg-primary px-4 text-white">
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleSidebar}
            className="p-1.5 text-primary-fixed-dim hover:text-white transition-colors"
            title="Toggle Menu"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-secondary text-white font-mono font-bold text-xs">
              TF
            </div>
            <span className="font-bold tracking-tight text-sm">TimeFlow</span>
          </div>
        </div>
      </div>

      <Sidebar />
      <main className="ml-0 lg:ml-[280px] min-h-[calc(100vh-3.5rem)] lg:min-h-screen p-4 sm:p-6 lg:p-12 max-w-[1500px]">
        {children}
      </main>
    </div>
  );
}
