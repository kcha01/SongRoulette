import { useEffect, useState } from "react";

import BenefitsSection from "@/components/common/BenefitsSection";
import HeroSection from "@/components/common/HeroSection";
import ModeSelector from "@/components/common/ModeSelector";
import SongResultCard from "@/components/common/SongResultCard";
import { getAnonymousId } from "@/lib/anonymous-user";
import {
  DailySongApiError,
  getDailySong,
} from "@/services/recommendation.service";
import type { RecommendationRequest, Song } from "@/types/recommendation";

function Home() {
  const [song, setSong] = useState<Song | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  useEffect(() => {
    if (!cooldownUntil) {
      setCooldownSeconds(0);
      return;
    }

    const updateCooldown = () => {
      const secondsLeft = Math.max(
        0,
        Math.ceil((cooldownUntil - Date.now()) / 1000),
      );

      setCooldownSeconds(secondsLeft);

      if (secondsLeft === 0) {
        setCooldownUntil(null);
      }
    };

    updateCooldown();

    const intervalId = window.setInterval(updateCooldown, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [cooldownUntil]);

  async function handleGenerate(request: RecommendationRequest) {
    if (cooldownSeconds > 0) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const generatedSong = await getDailySong({
        ...request,
        anonymousId: getAnonymousId(),
      });

      setSong(generatedSong);
    } catch (error) {
      if (error instanceof DailySongApiError) {
        setError(error.message);

        if (error.retryAfterSeconds) {
          setCooldownUntil(Date.now() + error.retryAfterSeconds * 1000);
        }

        return;
      }

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong while generating your song.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const isGenerateDisabled = isLoading || cooldownSeconds > 0;

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <HeroSection />

        <div className="grid items-stretch gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(420px,520px)]">
          <ModeSelector
            onGenerate={handleGenerate}
            isLoading={isLoading}
            isGenerateDisabled={isGenerateDisabled}
            cooldownSeconds={cooldownSeconds}
          />

          <SongResultCard song={song} />
        </div>

        {error && (
          <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            {cooldownSeconds > 0
              ? `${error} Try again in ${cooldownSeconds}s.`
              : error}
          </div>
        )}

        <BenefitsSection />
      </div>
    </div>
  );
}

export default Home;