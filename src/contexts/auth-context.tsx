"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { onAuthChange, logout as firebaseLogout, signInWithGoogle as firebaseGoogleSignIn } from "@/lib/auth";
import { getUserDoc, createOrUpdateUser } from "@/lib/firestore";
import { User } from "@/types/user";

interface AuthContextType {
  firebaseUser: FirebaseUser | { uid: string; displayName: string; email: string; photoURL?: string } | null;
  userProfile: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAsDemo: () => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  userProfile: null,
  loading: true,
  signInWithGoogle: async () => {},
  signInAsDemo: async () => {},
  logout: async () => {},
  refreshProfile: async () => {},
});

const DEMO_STORAGE_KEY = "chronodelta_demo_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (u: { uid: string; displayName?: string | null; email?: string | null; photoURL?: string | null }) => {
    // Immediately set profile from authenticated user info
    const initialProfile: User = {
      uid: u.uid,
      name: u.displayName || "Operator",
      email: u.email || "",
      photoURL: u.photoURL || "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      onboardingCompleted: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setUserProfile(initialProfile);

    try {
      const profile = await getUserDoc(u.uid);
      if (profile) {
        setUserProfile(profile);
      } else {
        await createOrUpdateUser(u.uid, initialProfile);
      }
    } catch {
      // Keep initialProfile if Firestore is not created yet
    }
  };

  useEffect(() => {
    // ─── Error Shield ─────────────────────────────────────────────────────────
    // Browser extensions (performance monitors, screen recorders, DevTools
    // helpers) inject PerformanceObserver scripts that crash on startTime/
    // reportAllChanges. These are NOT app errors — suppress them cleanly.
    const handleError = (event: ErrorEvent) => {
      const msg = event?.message || "";
      const stack = event?.error?.stack || "";
      const isExtensionError =
        stack.includes("chrome-extension://") ||
        stack.includes("moz-extension://") ||
        msg.includes("startTime") ||
        msg.includes("reportAllChanges");
      if (isExtensionError) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };
    const handleRejection = (event: PromiseRejectionEvent) => {
      const msg = event?.reason?.message || "";
      const stack = event?.reason?.stack || "";
      const isExtensionError =
        stack.includes("chrome-extension://") ||
        stack.includes("moz-extension://") ||
        msg.includes("startTime") ||
        msg.includes("reportAllChanges");
      if (isExtensionError) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };
    window.addEventListener("error", handleError, true);
    window.addEventListener("unhandledrejection", handleRejection, true);
    // ─────────────────────────────────────────────────────────────────────────

    // Check for demo user first in localStorage
    const savedDemo = typeof window !== "undefined" ? localStorage.getItem(DEMO_STORAGE_KEY) : null;
    if (savedDemo) {
      try {
        const demoData = JSON.parse(savedDemo);
        setFirebaseUser(demoData);
        fetchProfile(demoData);
        setLoading(false);
        return;
      } catch (e) {
        localStorage.removeItem(DEMO_STORAGE_KEY);
      }
    }

    const unsub = onAuthChange(async (u) => {
      setFirebaseUser(u);
      if (u) {
        await fetchProfile(u);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return () => {
      unsub();
      window.removeEventListener("error", handleError, true);
      window.removeEventListener("unhandledrejection", handleRejection, true);
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      const res = await firebaseGoogleSignIn();
      if (res?.user) {
        setLoading(true);
        setFirebaseUser(res.user);
        await fetchProfile(res.user);
      }
    } catch (err: any) {
      console.error("Google sign in failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInAsDemo = async () => {
    setLoading(true);
    try {
      const demoUser = {
        uid: "demo_operator_01",
        displayName: "Flight Lead / Operator",
        email: "operator@chronodelta.internal",
        photoURL: "",
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoUser));
      }
      setFirebaseUser(demoUser);
      await fetchProfile(demoUser);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(DEMO_STORAGE_KEY);
      }
      await firebaseLogout();
      setFirebaseUser(null);
      setUserProfile(null);
    } catch (e) {
      setFirebaseUser(null);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (firebaseUser) {
      await fetchProfile(firebaseUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        userProfile,
        loading,
        signInWithGoogle,
        signInAsDemo,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);