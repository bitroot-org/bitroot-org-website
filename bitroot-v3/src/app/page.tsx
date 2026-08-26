import Hero from "@/components/home/Hero";
import HeroTicker from "@/components/home/HeroTicker";
import LaneSection from "@/components/home/LaneSection";
import BitStudioSpotlight from "@/components/home/BitStudioSpotlight";
// ARCHIVED 2026-07-14 — deals platter hidden from homepage, do not delete, may be restored later
// import DealsPlatter from "@/components/home/DealsPlatter";
import BuiltFor from "@/components/home/BuiltFor";
// import ReelsSection from "@/components/home/ReelsSection"; // hidden until videos are ready
import NewsloggerSection from "@/components/home/NewsloggerSection";
// import QuotesSection from "@/components/home/QuotesSection"; // hidden until we have real quotes
import ClubBanner from "@/components/home/ClubBanner";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, siteUrl } from "@/lib/seo";

const homeItemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Free Tools and Guides for Founders",
  url: siteUrl,
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Guides", url: `${siteUrl}/guides/` },
    { "@type": "ListItem", position: 2, name: "Kits", url: `${siteUrl}/kits/` },
    { "@type": "ListItem", position: 3, name: "Tools", url: `${siteUrl}/tools/` },
  ],
};

export default function Home() {
  return (
    <>
      <JsonLd data={homeItemListJsonLd} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }])} />
      <Hero />
      <HeroTicker />
      <LaneSection />
      <BitStudioSpotlight />
      {/* ARCHIVED 2026-07-14 — deals platter hidden from homepage, do not delete, may be restored later */}
      {/* <DealsPlatter /> */}
      <BuiltFor />
      {/* <ReelsSection /> — hidden until videos are ready */}
      <NewsloggerSection />
      <ClubBanner />
      {/* <QuotesSection /> — hidden until we have real quotes */}
    </>
  );
}