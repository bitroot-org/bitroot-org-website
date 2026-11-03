import { registerProps, track } from "@/lib/analytics";

/**
 * Bruh / Baddie — a site-wide "vibe" switch. The vibe lives on
 * <html data-vibe>; every colour, radius and the alt display face read
 * --vibe-* variables (globals.css), so flipping the attribute re-skins the
 * whole site. Copy that changes per vibe goes through <VibeText>.
 *
 * Bruh is the default and is what the static HTML (and crawlers) get.
 * The choice is a per-visitor convenience kept in localStorage; /blog reads
 * the same key since it is the same origin.
 */
export type Vibe = "bruh" | "baddie";

export const VIBE_STORAGE_KEY = "bitroot_vibe";
const EVENT = "bitroot:vibe";

export const VIBE_LABELS: Record<Vibe, string> = { bruh: "Bruh", baddie: "Baddie" };

/** Runs inline in <head> before first paint. Keep it tiny and dependency-free. */
export const VIBE_INIT_SCRIPT = `(function(){var d=document.documentElement,v="bruh";try{var q=new URLSearchParams(location.search).get("vibe");if(q==="bruh"||q==="baddie"){v=q;localStorage.setItem("${VIBE_STORAGE_KEY}",q)}else if(localStorage.getItem("${VIBE_STORAGE_KEY}")==="baddie"){v="baddie"}}catch(e){}d.setAttribute("data-vibe",v);setTimeout(function(){d.setAttribute("data-vibe-ready","")},2500)})();`;

export function getVibe(): Vibe {
  if (typeof document === "undefined") return "bruh";
  return document.documentElement.dataset.vibe === "baddie" ? "baddie" : "bruh";
}

export function getServerVibe(): Vibe {
  return "bruh";
}

export function subscribeVibe(cb: () => void): () => void {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}

export function setVibe(vibe: Vibe, location: string) {
  const root = document.documentElement;
  if (root.dataset.vibe === vibe) return;
  root.dataset.vibe = vibe;
  try {
    localStorage.setItem(VIBE_STORAGE_KEY, vibe);
  } catch {
    /* private mode / blocked storage: the switch still works for this page */
  }
  window.dispatchEvent(new Event(EVENT));
  registerProps({ vibe });
  track("cta_click", { label: "vibe_toggle", location, vibe });
}

/** Mark the page ready once the client has swapped any vibe copy. */
export function markVibeReady() {
  requestAnimationFrame(() =>
    document.documentElement.setAttribute("data-vibe-ready", ""),
  );
}
