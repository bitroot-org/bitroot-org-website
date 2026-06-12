import type { Metadata } from "next";
import LegalArticle from "@/components/legal/LegalArticle";
import { getDoc } from "@/content/legal-content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Refund Policy",
  description:
    "Bitroot’s refund terms for consulting, project work, and Platter subscriptions.",
  path: "/legal/refund/",
});

export default function RefundPage() {
  return <LegalArticle doc={getDoc("refund")} />;
}
