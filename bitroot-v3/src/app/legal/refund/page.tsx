import type { Metadata } from "next";
import LegalArticle from "@/components/legal/LegalArticle";
import { getDoc } from "@/content/legal-content";

export const metadata: Metadata = {
  title: "Refund Policy — Bitroot",
  description:
    "Bitroot’s refund terms for consulting, project work, and Platter subscriptions.",
};

export default function RefundPage() {
  return <LegalArticle doc={getDoc("refund")} />;
}
