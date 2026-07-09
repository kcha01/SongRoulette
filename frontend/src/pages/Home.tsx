import BenefitsSection from "@/components/common/BenefitsSection";
import HeroSection from "@/components/common/HeroSection";
import ModeSelector from "@/components/common/ModeSelector";
import SongResultCard from "@/components/common/SongResultCard";

function Home() {
  return (
    <div className="space-y-10">
      <HeroSection />
      <ModeSelector />
      <SongResultCard />
      <BenefitsSection />
    </div>
  );
}

export default Home;