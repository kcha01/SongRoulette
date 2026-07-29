import { useState } from "react";

import BenefitsSection from "@/components/common/BenefitsSection";
import HeroSection from "@/components/common/HeroSection";
import ModeSelector from "@/components/common/ModeSelector";
import SongResultCard from "@/components/common/SongResultCard";
import { getAnonymousId } from "@/lib/anonymous-user";
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

      const generatedSong = await getDailySong({
        ...request,
        anonymousId: getAnonymousId(),
      });

      setSong(generatedSong);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong while generating your song.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <HeroSection />

        <div className="grid items-start gap-8 lg:grid-cols-2">
          <div className="h-full">
            <ModeSelector onGenerate={handleGenerate} isLoading={isLoading} />
          </div>

          <div className="h-full">
            <SongResultCard song={song} />
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        <BenefitsSection />
      </div>
    </div>
  );
}

export default Home;