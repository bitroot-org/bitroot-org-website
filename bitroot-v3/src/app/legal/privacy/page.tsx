import type { Metadata } from "next";
import LegalArticle from "@/components/legal/LegalArticle";
import { getDoc } from "@/content/legal-content";

export const metadata: Metadata = {
  title: "Privacy Policy — Bitroot",
  description:
    "How Bitroot collects, uses, and protects your personal data across bitroot.org and related platforms.",
};

export default function PrivacyPage() {
  return <LegalArticle doc={getDoc("privacy")} />;
}
