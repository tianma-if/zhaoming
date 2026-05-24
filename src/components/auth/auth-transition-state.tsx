"use client";

import { Loader2 } from "lucide-react";
import { useSyncExternalStore } from "react";

type Listener = () => void;

let isPending = false;
let resetTimer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<Listener>();

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

function scheduleReset() {
  if (resetTimer) {
    clearTimeout(resetTimer);
  }

  resetTimer = setTimeout(() => {
    finishAuthTransition();
  }, 15000);
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return isPending;
}

export function startAuthTransition() {
  isPending = true;
  scheduleReset();
  emit();
}

export function finishAuthTransition() {
  isPending = false;

  if (resetTimer) {
    clearTimeout(resetTimer);
    resetTimer = null;
  }

  emit();
}

export function useAuthTransitionPending() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function AuthTransitionOverlay() {
  const pending = useAuthTransitionPending();

  if (!pending) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-white/78 backdrop-blur-sm">
      <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/95 px-5 py-4 text-sm text-foreground shadow-[0_22px_50px_-28px_rgba(17,17,17,0.28)]">
        <Loader2 className="size-4 animate-spin" />
        <span>正在登录…</span>
      </div>
    </div>
  );
}
