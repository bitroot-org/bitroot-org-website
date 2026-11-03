// GenZ revamp (2026-11): the old Hero / HeroTicker / LaneSection /
// BitStudioSpotlight / BuiltFor sections are replaced by the genz/* sections
// below. The old components stay in the repo in case we want them back.
import GzHero from "@/components/home/genz/GzHero";
import GzManifesto from "@/components/home/genz/GzManifesto";
import GzLanes from "@/components/home/genz/GzLanes";
import GzDrops from "@/components/home/genz/GzDrops";
import GzBrowse from "@/components/home/genz/GzBrowse";
// ARCHIVED 2026-07-14 — deals platter hidden from homepage, do not delete, may be restored later
// import DealsPlatter from "@/components/home/DealsPlatter";
// import ReelsSection from "@/components/home/ReelsSection"; // hidden until videos are ready
import NewsloggerSection from "@/components/home/NewsloggerSection";
// import QuotesSection from "@/components/home/QuotesSection"; // hidden until we have real quotes
import ClubBanner from "@/components/home/ClubBanner";
import JsonLd from "@/components/JsonLd";
import { siteUrl } from "@/lib/seo";

const homeItemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Free Tools and Guides for Founders",
  url: siteUrl,
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Guides", url: `${siteUrl}/guides/` },
    { "@type": "ListItem", position: 2, name: "Kits", url: `${siteUrl}/kits/` },
    { "@type": "ListItem", position: 3, name: "Tools", url: `${siteUrl}/tools/` },
    { "@type": "ListItem", position: 4, name: "Products", url: `${siteUrl}/products/` },
    { "@type": "ListItem", position: 5, name: "Skills", url: `${siteUrl}/skills/` },
    { "@type": "ListItem", position: 6, name: "MCP servers", url: `${siteUrl}/mcp/` },
    { "@type": "ListItem", position: 7, name: "Plugins", url: `${siteUrl}/plugins/` },
    { "@type": "ListItem", position: 8, name: "CLIs & SDKs", url: `${siteUrl}/cli/` },
    { "@type": "ListItem", position: 9, name: "Packs", url: `${siteUrl}/packs/` },
  ],
};

export default function Home() {
  return (
    <>
      <JsonLd data={homeItemListJsonLd} />
      <GzHero />
      <GzManifesto />
      <GzLanes />
      <GzDrops />
      <GzBrowse />
      {/* ARCHIVED 2026-07-14 — deals platter hidden from homepage, do not delete, may be restored later */}
      {/* <DealsPlatter /> */}
      {/* <ReelsSection /> — hidden until videos are ready */}
      <NewsloggerSection />
      <ClubBanner />
      {/* <QuotesSection /> — hidden until we have real quotes */}
    </>
  );
}