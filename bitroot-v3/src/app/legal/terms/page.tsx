import type { Metadata } from "next";
import LegalArticle from "@/components/legal/LegalArticle";
import { getDoc } from "@/content/legal-content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description:
    "Terms governing access to and use of bitroot.org, Bitroot services, and related platforms.",
  path: "/legal/terms/",
});

export default function TermsPage() {
  return <LegalArticle doc={getDoc("terms")} />;
}
