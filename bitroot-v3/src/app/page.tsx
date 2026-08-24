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

export default function Home() {
  return (
    <>
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