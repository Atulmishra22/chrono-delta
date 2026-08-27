"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export default function LoginPage() {
  const { firebaseUser, userProfile, loading, signInWithGoogle, signInAsDemo } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isConfigError, setIsConfigError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && firebaseUser) {
      if (userProfile && !userProfile.onboardingCompleted) {
        router.push("/onboarding");
      } else {
        router.push("/app/dashboard");
      }
    }
  }, [firebaseUser, userProfile, loading, router]);

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsConfigError(false);
    setSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      const code = err?.code || "";
      const msg = err?.message || "";
      if (code.includes("configuration-not-found") || msg.includes("CONFIGURATION_NOT_FOUND")) {
        setIsConfigError(true);
        setError("Google Sign-In is not enabled yet in your Firebase Console.");
      } else {
        setError(msg || "Failed to sign in with Google.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoSignIn = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await signInAsDemo();
    } catch (err: any) {
      setError(err?.message || "Failed to enter demo mode.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-[2px] border border-outline-variant bg-surface-container-lowest p-8 shadow-sm">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-primary text-white font-mono font-bold text-xl mb-4">
            TF
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">TimeFlow</h1>
          <p className="mt-1 text-xs text-on-surface-variant font-mono uppercase tracking-wider">
            Precision Time Management & Schedule Intelligence
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mt-6 rounded-[2px] border border-error-alert/30 bg-error-container p-4 text-xs font-mono text-on-error-container flex flex-col gap-2">
            <div className="flex items-center gap-1.5 font-bold">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{error}</span>
            </div>
            {isConfigError && (
              <div className="text-[11px] leading-relaxed text-on-error-container/90 bg-white/40 p-2 rounded-[2px] border border-error-alert/20">
                <span className="font-bold">To enable Google Auth:</span>
                <ol className="list-decimal pl-4 mt-1 space-y-1">
                  <li>Open <a href="https://console.firebase.google.com/project/timeflow-515fd/authentication" target="_blank" rel="noreferrer" className="underline font-bold">Firebase Console</a></li>
                  <li>Click <b>Get Started</b> in Authentication</li>
                  <li>Go to <b>Sign-in method</b> tab &rarr; Enable <b>Google</b> &rarr; Click Save</li>
                </ol>
              </div>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="mt-8 flex flex-col gap-3.5">
          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={submitting}
            className="flex items-center justify-center gap-3 w-full rounded-[2px] bg-primary py-3 px-4 text-xs font-bold uppercase tracking-wider text-white hover:brightness-110 active:scale-[0.99] transition-all font-mono disabled:opacity-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
              />
            </svg>
            <span>{submitting ? "Authenticating..." : "Continue with Google"}</span>
          </button>

          <div className="relative flex items-center justify-center my-1">
            <div className="border-t border-outline-variant/40 w-full" />
            <span className="bg-surface-container-lowest px-2 font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">
              OR
            </span>
          </div>

          {/* Instant Demo Access Button */}
          <button
            onClick={handleDemoSignIn}
            disabled={submitting}
            className="flex items-center justify-center gap-2 w-full rounded-[2px] border border-secondary/40 bg-secondary-container/40 py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-on-secondary-container hover:bg-secondary-container/70 active:scale-[0.99] transition-all font-mono disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px]">bolt</span>
            <span>Enter as Demo Operator (Instant)</span>
          </button>
        </div>

        <div className="mt-8 border-t border-outline-variant/40 pt-4 text-center">
          <p className="text-[11px] font-mono text-on-surface-variant">
            By accessing TimeFlow, you agree to precision schedule monitoring.
          </p>
        </div>
      </div>
    </div>
  );
}