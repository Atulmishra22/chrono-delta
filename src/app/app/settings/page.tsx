"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { createOrUpdateUser } from "@/lib/firestore";
import { AppLayout } from "@/components/layout/app-layout";

export default function SettingsPage() {
  const { firebaseUser, userProfile, logout, refreshProfile } = useAuth();

  const [name, setName] = useState(userProfile?.name || firebaseUser?.displayName || "");
  const [timezone, setTimezone] = useState(
    userProfile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser) return;
    setSaving(true);
    try {
      await createOrUpdateUser(firebaseUser.uid, {
        name: name.trim(),
        timezone,
      });
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl flex flex-col gap-8">
        {/* Header */}
        <div className="pb-6 border-b border-outline-variant/60">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-primary">
            System Preferences & Profile
          </h1>
          <p className="text-xs lg:text-sm text-on-surface-variant mt-0.5">
            Configure telemetry timezone, operator credentials, and operational controls.
          </p>
        </div>

        {/* Profile Card */}
        <div className="rounded-[2px] border border-outline-variant bg-surface-container-lowest p-7 shadow-xs">
          <div className="flex items-center gap-2 pb-4 border-b border-outline-variant/40">
            <span className="material-symbols-outlined text-primary text-[20px]">person</span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary font-mono">
              Operator Profile
            </h2>
          </div>

          <form onSubmit={handleSaveProfile} className="mt-6 flex flex-col gap-5 font-mono text-xs">
            <div className="flex items-center gap-4">
              {userProfile?.photoURL ? (
                <img
                  src={userProfile.photoURL}
                  alt="Avatar"
                  className="h-16 w-16 rounded-full border border-outline-variant object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white text-xl font-bold">
                  {name ? name.charAt(0).toUpperCase() : "U"}
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-bold text-primary text-sm font-sans">{name || "User"}</span>
                <span className="text-on-surface-variant">{firebaseUser?.email}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-bold uppercase text-on-surface-variant text-[11px]">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-[2px] border border-outline-variant bg-white p-2.5 font-sans focus:outline-primary"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-bold uppercase text-on-surface-variant text-[11px]">
                Email Address (Read-Only)
              </label>
              <input
                type="email"
                value={firebaseUser?.email || ""}
                disabled
                className="rounded-[2px] border border-outline-variant bg-surface-container-low p-2.5 text-on-surface-variant cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-bold uppercase text-on-surface-variant text-[11px]">
                Telemetry Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="rounded-[2px] border border-outline-variant bg-white p-2.5 focus:outline-primary"
              >
                <option value="UTC">UTC (Universal Time Coordinated)</option>
                <option value="America/New_York">America/New_York (EST/EDT)</option>
                <option value="America/Los_Angeles">America/Los_Angeles (PST/PDT)</option>
                <option value="Europe/London">Europe/London (GMT/BST)</option>
                <option value="Europe/Berlin">Europe/Berlin (CET/CEST)</option>
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-outline-variant/40">
              {saved ? (
                <span className="text-secondary font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  Changes synchronized.
                </span>
              ) : <div />}
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-[2px] bg-primary px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:brightness-110 font-mono disabled:opacity-50"
              >
                <span>{saving ? "Saving..." : "Save Settings"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Account Controls */}
        <div className="rounded-[2px] border border-outline-variant bg-surface-container-lowest p-7 shadow-xs">
          <div className="flex items-center gap-2 pb-4 border-b border-outline-variant/40">
            <span className="material-symbols-outlined text-primary text-[20px]">manage_accounts</span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary font-mono">
              Session Management
            </h2>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-bold text-xs text-primary font-mono uppercase">Terminate Session</span>
              <span className="text-xs text-on-surface-variant mt-0.5">
                Sign out of current browser instance.
              </span>
            </div>
            <button
              onClick={() => logout()}
              className="flex items-center gap-1.5 rounded-[2px] border border-error-alert/40 text-error-alert hover:bg-error-container/40 px-4 py-2 text-xs font-bold uppercase font-mono transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
