// Client for the `bitroot-forms` Cloudflare Worker (source: /api/worker.js in
// this repo). The Worker writes to the shared Neon DB, syncs newsletter
// subscribers to MailerLite, and sends Brevo confirmation emails.
const API_BASE =
  process.env.NEXT_PUBLIC_FORMS_API ?? "https://api.bitroot.in";

type FormResult = { ok: boolean; error?: string };

async function post(path: string, payload: Record<string, unknown>): Promise<FormResult> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => null)) as FormResult | null;
    if (!res.ok || !data?.ok) {
      return { ok: false, error: data?.error ?? `http_${res.status}` };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "network" };
  }
}

export function subscribeNewsletter(email: string, location: string) {
  return post("/v1/newsletter", { email, location, site: "org" });
}

export function requestEarlyAccess(input: {
  name: string;
  email: string;
  product: string;
  productName: string;
  program: "core" | "creators";
  handle?: string;
  context?: string;
}) {
  return post("/v1/early-access", input);
}

export function sendContactMessage(input: {
  name?: string;
  email: string;
  topic?: string;
  message: string;
}) {
  return post("/v1/contact", input);
}
