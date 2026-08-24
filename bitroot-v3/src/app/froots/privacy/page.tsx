import type { Metadata } from "next";
import FrootsPolicy from "@/components/froots/FrootsPolicy";
import { frootsPrivacy } from "@/content/froots-content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Froots — Privacy Policy",
  description:
    "Froots is a new-tab Chrome extension by Bitroot. It keeps everything on your device and sends none of your data to us or anyone else.",
  path: "/froots/privacy/",
});

export default function FrootsPrivacyPage() {
  return <FrootsPolicy doc={frootsPrivacy} />;
}
