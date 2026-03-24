"use client";

/**
 * SessionGuard — HIPAA session timeout enforcement
 *
 * Monitors user inactivity. At 12 minutes: shows a countdown warning modal.
 * At 15 minutes: signs the user out automatically.
 *
 * Only activates when a Supabase session exists (no-ops for public visitors).
 * Mounted once in app/layout.tsx.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const WARNING_AFTER_MS = 12 * 60 * 1000; // 12 minutes
const LOGOUT_AFTER_MS = 15 * 60 * 1000; // 15 minutes
const ACTIVITY_DEBOUNCE_MS = 10_000; // don't reset timers more than once per 10s

const ACTIVITY_EVENTS = [
  "mousemove",
  "mousedown",
  "keydown",
  "scroll",
  "touchstart",
  "click",
] as const;

export default function SessionGuard() {
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(180);
  const isActiveSession = useRef(false);
  const lastActivity = useRef(Date.now());
  const warningTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdown = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearAll = useCallback(() => {
    if (warningTimer.current) clearTimeout(warningTimer.current);
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    if (countdown.current) clearInterval(countdown.current);
  }, []);

  const signOut = useCallback(async () => {
    clearAll();
    setShowWarning(false);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login?reason=session_expired");
  }, [clearAll, router]);

  const startTimers = useCallback(() => {
    clearAll();
    setShowWarning(false);

    warningTimer.current = setTimeout(() => {
      setShowWarning(true);
      setSecondsLeft(180); // 3-minute countdown
      countdown.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            signOut();
            return 0;
          }
          return s - 1;
        });
      }, 1_000);
    }, WARNING_AFTER_MS);

    logoutTimer.current = setTimeout(signOut, LOGOUT_AFTER_MS);
  }, [clearAll, signOut]);

  const handleActivity = useCallback(() => {
    if (!isActiveSession.current) return;
    const now = Date.now();
    if (now - lastActivity.current < ACTIVITY_DEBOUNCE_MS) return;
    lastActivity.current = now;
    startTimers();
  }, [startTimers]);

  const extendSession = useCallback(() => {
    startTimers();
  }, [startTimers]);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!mounted || !user) return;
      isActiveSession.current = true;
      startTimers();
      ACTIVITY_EVENTS.forEach((ev) =>
        window.addEventListener(ev, handleActivity, { passive: true })
      );
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (session?.user && !isActiveSession.current) {
        isActiveSession.current = true;
        startTimers();
        ACTIVITY_EVENTS.forEach((ev) =>
          window.addEventListener(ev, handleActivity, { passive: true })
        );
      }
      if (!session?.user && isActiveSession.current) {
        isActiveSession.current = false;
        clearAll();
        ACTIVITY_EVENTS.forEach((ev) =>
          window.removeEventListener(ev, handleActivity)
        );
      }
    });

    return () => {
      mounted = false;
      clearAll();
      ACTIVITY_EVENTS.forEach((ev) =>
        window.removeEventListener(ev, handleActivity)
      );
      subscription.unsubscribe();
    };
  }, [startTimers, handleActivity, clearAll]);

  if (!showWarning) return null;

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeStr = `${mins}:${String(secs).padStart(2, "0")}`;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="session-warning-title"
      aria-describedby="session-warning-desc"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/75 backdrop-blur-sm"
    >
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl">
        <div className="mb-4 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
            <ClockIcon className="h-6 w-6 text-amber-600" aria-hidden="true" />
          </div>
        </div>

        <h2
          id="session-warning-title"
          className="mb-1 text-center text-lg font-semibold text-slate-900"
        >
          Session Expiring Soon
        </h2>
        <p
          id="session-warning-desc"
          className="mb-6 text-center text-sm text-slate-500"
        >
          For your security, you&apos;ll be logged out in{" "}
          <span className="font-semibold tabular-nums text-amber-600">
            {timeStr}
          </span>{" "}
          due to inactivity.
        </p>

        <div className="flex flex-col gap-2">
          <button
            onClick={extendSession}
            className="w-full rounded-full bg-teal-600 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Continue Session
          </button>
          <button
            onClick={signOut}
            className="w-full rounded-full py-2.5 text-sm font-medium text-slate-500 transition hover:text-slate-700 focus:outline-none"
          >
            Log out now
          </button>
        </div>
      </div>
    </div>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
