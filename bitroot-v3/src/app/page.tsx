import Hero from "@/components/home/Hero";
import HeroTicker from "@/components/home/HeroTicker";
import LaneSection from "@/components/home/LaneSection";
import BitStudioSpotlight from "@/components/home/BitStudioSpotlight";
import DealsPlatter from "@/components/home/DealsPlatter";
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
      <DealsPlatter />
      <BuiltFor />
      <ClubBanner />
      {/* <ReelsSection /> — hidden until we have ready videos */}
      <NewsloggerSection />
      {/* <QuotesSection /> — hidden until we have real quotes */}
    </>
  );
}