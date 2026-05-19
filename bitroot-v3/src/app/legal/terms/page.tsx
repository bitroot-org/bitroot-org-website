import type { Metadata } from "next";
import LegalArticle from "@/components/legal/LegalArticle";
import { getDoc } from "@/content/legal-content";

export const metadata: Metadata = {
  title: "Terms of Service — Bitroot",
  description:
    "Terms governing access to and use of bitroot.org, Bitroot services, and related platforms.",
};

export default function TermsPage() {
  return <LegalArticle doc={getDoc("terms")} />;
}
