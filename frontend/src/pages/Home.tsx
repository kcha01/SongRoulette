import { useState } from "react";

import BenefitsSection from "@/components/common/BenefitsSection";
import HeroSection from "@/components/common/HeroSection";
import ModeSelector from "@/components/common/ModeSelector";
import SongResultCard from "@/components/common/SongResultCard";
import { getDailySong } from "@/services/recommendation.service";
import type { RecommendationRequest, Song } from "@/types/recommendation";

function Home() {
  const [song, setSong] = useState<Song | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate(request: RecommendationRequest) {
    try {
      setIsLoading(true);
      setError(null);

      const generatedSong = await getDailySong(request);

      setSong(generatedSong);
    } catch {
      setError("Something went wrong while generating your song.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-10">
      <HeroSection />

      <ModeSelector onGenerate={handleGenerate} isLoading={isLoading} />

      {error && (
        <div className="mx-auto max-w-3xl rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <SongResultCard song={song} />

      <BenefitsSection />
    </div>
  );
}

export default Home;