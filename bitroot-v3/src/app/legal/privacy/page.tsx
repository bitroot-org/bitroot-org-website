import type { Metadata } from "next";
import LegalArticle from "@/components/legal/LegalArticle";
import { getDoc } from "@/content/legal-content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How Bitroot collects, uses, and protects your personal data across bitroot.org and related platforms.",
  path: "/legal/privacy/",
});

export default function PrivacyPage() {
  return <LegalArticle doc={getDoc("privacy")} />;
}
