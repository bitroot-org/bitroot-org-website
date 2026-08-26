/**
 * Shared "content unlocked" state for the signup gate + popup.
 *
 * Unlocking is permanent (localStorage) — once someone gives an email via
 * either the popup or an inline content gate, every gate on every future
 * visit stays open. The popup's own "have we shown it this session" flag is
 * separate and session-scoped (sessionStorage), so it can re-appear next
 * session for visitors who dismissed without signing up.
 */

const UNLOCK_KEY = "bitroot_gate_unlocked";
const POPUP_SEEN_KEY = "bitroot_popup_seen";
const UNLOCK_EVENT = "bitroot:gate-unlocked";

export function isGateUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(UNLOCK_KEY) === "1";
  } catch {
    return false;
  }
}

export function unlockGate() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(UNLOCK_KEY, "1");
  } catch {
    // Storage unavailable (private mode, etc.) — unlock still applies for this render via the dispatched event.
  }
  window.dispatchEvent(new Event(UNLOCK_EVENT));
}

export function onGateUnlocked(cb: () => void): () => void {
  window.addEventListener(UNLOCK_EVENT, cb);
  return () => window.removeEventListener(UNLOCK_EVENT, cb);
}

export function hasSeenPopupThisSession(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(POPUP_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

export function markPopupSeenThisSession() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(POPUP_SEEN_KEY, "1");
  } catch {
    // Ignore — worst case the popup can show again this session.
  }
}
