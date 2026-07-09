import { useState } from "react";

import BenefitsSection from "@/components/common/BenefitsSection";
import HeroSection from "@/components/common/HeroSection";
import ModeSelector from "@/components/common/ModeSelector";
import SongResultCard from "@/components/common/SongResultCard";
import {
  discoveryModes,
  eras,
  genres,
  moods,
} from "@/lib/recommendation-options";
import type { RecommendationRequest, Song } from "@/types/recommendation";

const mockSongs: Omit<Song, "tags">[] = [
  {
    id: "1",
    title: "Midnight City",
    artist: "M83",
    album: "Hurry Up, We're Dreaming",
    spotifyUrl: "https://open.spotify.com",
  },
  {
    id: "2",
    title: "Do I Wanna Know?",
    artist: "Arctic Monkeys",
    album: "AM",
    spotifyUrl: "https://open.spotify.com",
  },
  {
    id: "3",
    title: "Sweet Disposition",
    artist: "The Temper Trap",
    album: "Conditions",
    spotifyUrl: "https://open.spotify.com",
  },
];

function getLabel<T extends string>(
  options: { label: string; value: T }[],
  value: T
) {
  return options.find((option) => option.value === value)?.label ?? value;
}

function buildMockSong(request: RecommendationRequest): Song {
  const randomIndex = Math.floor(Math.random() * mockSongs.length);
  const song = mockSongs[randomIndex];

  if (request.mode === "random") {
    return {
      ...song,
      tags: ["Surprise me", request.allowExplicit ? "Explicit allowed" : "Clean"],
    };
  }

  return {
    ...song,
    tags: [
      getLabel(moods, request.mood),
      getLabel(genres, request.genre),
      getLabel(discoveryModes, request.discovery),
      getLabel(eras, request.era),
      request.allowExplicit ? "Explicit allowed" : "Clean",
    ],
  };
}

function Home() {
  const [song, setSong] = useState<Song | null>(null);

  function handleGenerate(request: RecommendationRequest) {
    const generatedSong = buildMockSong(request);
    setSong(generatedSong);
  }

  return (
    <div className="space-y-10">
      <HeroSection />
      <ModeSelector onGenerate={handleGenerate} />
      <SongResultCard song={song} />
      <BenefitsSection />
    </div>
  );
}

export default Home;