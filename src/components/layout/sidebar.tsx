"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { name: "DASHBOARD", href: "/app/dashboard", icon: "dashboard" },
  { name: "PROJECTS", href: "/app/projects", icon: "folder_open" },
  { name: "SETTINGS", href: "/app/settings", icon: "settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { userProfile, logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[280px] flex-col bg-primary text-on-primary">
      {/* Header / Brand */}
      <div className="flex flex-col gap-3 p-6 border-b border-primary-container/40">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-secondary text-on-secondary font-mono font-bold text-lg">
            TF
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white leading-tight">TimeFlow</span>
            <span className="text-[10px] font-bold tracking-widest text-primary-fixed-dim uppercase">
              Command Center
            </span>
          </div>
        </div>

        {/* New Entry CTA */}
        <Link
          href="/app/projects/new"
          className="mt-2 flex items-center justify-center gap-2 w-full rounded-[2px] bg-secondary px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-on-secondary shadow-sm hover:brightness-110 active:scale-[0.99] transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>New Project</span>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-1 flex-col gap-1 px-3 py-6">
        <div className="px-3 pb-2 text-[10px] font-bold tracking-widest uppercase text-primary-fixed-dim/60">
          Navigation
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3.5 rounded-[2px] px-3.5 py-3 text-xs font-semibold tracking-wider uppercase transition-colors",
                isActive
                  ? "bg-surface-tint/20 text-white border-l-4 border-secondary-fixed pl-2.5 font-bold"
                  : "text-on-primary/70 hover:bg-primary-fixed-dim/10 hover:text-white"
              )}
            >
              <span
                className={cn(
                  "material-symbols-outlined text-[18px]",
                  isActive && "text-secondary-fixed fill"
                )}
              >
                {item.icon}
              </span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User profile & footer */}
      <div className="mt-auto border-t border-primary-container/40 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            {userProfile?.photoURL ? (
              <img
                src={userProfile.photoURL}
                alt="Profile"
                className="h-8 w-8 rounded-full border border-primary-fixed-dim/30 object-cover shrink-0"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container text-white text-xs font-bold shrink-0">
                {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="truncate text-xs font-semibold text-white">
                {userProfile?.name || "User"}
              </span>
              <span className="truncate text-[10px] text-primary-fixed-dim/70">
                {userProfile?.email}
              </span>
            </div>
          </div>
          <button
            onClick={() => logout()}
            title="Logout"
            className="p-1.5 text-primary-fixed-dim hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
