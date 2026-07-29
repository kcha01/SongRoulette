import { useState } from "react";

import { Button } from "@/components/ui/button";
import type {
  DiscoveryMode,
  Era,
  Genre,
  Mood,
  RecommendationMode,
  RecommendationRequest,
} from "@/types/recommendation";

type ModeSelectorProps = {
  onGenerate: (request: RecommendationRequest) => void | Promise<void>;
  isLoading?: boolean;
};

const moods: { value: Mood; label: string }[] = [
  { value: "happy", label: "Happy" },
  { value: "chill", label: "Chill" },
  { value: "sad", label: "Sad" },
  { value: "energetic", label: "Energetic" },
  { value: "romantic", label: "Romantic" },
  { value: "focused", label: "Focused" },
];

const genres: { value: Genre; label: string }[] = [
  { value: "pop", label: "Pop" },
  { value: "rock", label: "Rock" },
  { value: "hip-hop", label: "Hip-hop" },
  { value: "electronic", label: "Electronic" },
  { value: "jazz", label: "Jazz" },
  { value: "indie", label: "Indie" },
  { value: "metal", label: "Metal" },
  { value: "rnb", label: "R&B" },
  { value: "lofi", label: "Lo-fi" },
];

const discoveryModes: { value: DiscoveryMode; label: string }[] = [
  { value: "popular", label: "Popular" },
  { value: "balanced", label: "Balanced" },
  { value: "hidden-gems", label: "Hidden gems" },
];

const eras: { value: Era; label: string }[] = [
  { value: "any", label: "Any era" },
  { value: "new", label: "New releases" },
  { value: "2000s", label: "2000s" },
  { value: "2010s", label: "2010s" },
  { value: "2020s", label: "2020s" },
  { value: "oldies", label: "Oldies" },
];

function ModeSelector({ onGenerate, isLoading = false }: ModeSelectorProps) {
  const [mode, setMode] = useState<RecommendationMode>("guided");
  const [mood, setMood] = useState<Mood>("chill");
  const [genre, setGenre] = useState<Genre>("indie");
  const [discovery, setDiscovery] = useState<DiscoveryMode>("balanced");
  const [era, setEra] = useState<Era>("any");
  const [allowExplicit, setAllowExplicit] = useState(false);

  function handleGenerate() {
    if (mode === "random") {
      onGenerate({
        mode: "random",
        allowExplicit,
      });

      return;
    }

    onGenerate({
      mode: "guided",
      mood,
      genre,
      discovery,
      era,
      allowExplicit,
    });
  }

  return (
    <section className="h-full rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
      <div className="flex h-full flex-col gap-6">
        <div>
          <h2 className="text-xl font-semibold">
            How do you want to find today&apos;s song?
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Choose your preferences or let SongRoulette pick something
            unexpected.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            type="button"
            variant={mode === "guided" ? "default" : "outline"}
            onClick={() => setMode("guided")}
            disabled={isLoading}
          >
            Choose my vibe
          </Button>

          <Button
            type="button"
            variant={mode === "random" ? "default" : "outline"}
            onClick={() => setMode("random")}
            disabled={isLoading}
          >
            Surprise me
          </Button>
        </div>

        {mode === "guided" && (
          <div className="space-y-6">
            <div>
              <p className="mb-3 text-sm font-medium">Mood</p>

              <div className="flex flex-wrap gap-2">
                {moods.map((item) => (
                  <Button
                    key={item.value}
                    type="button"
                    size="sm"
                    variant={mood === item.value ? "default" : "outline"}
                    onClick={() => setMood(item.value)}
                    disabled={isLoading}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium">Genre</span>
                <select
                  value={genre}
                  onChange={(event) => setGenre(event.target.value as Genre)}
                  disabled={isLoading}
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                >
                  {genres.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium">Era</span>
                <select
                  value={era}
                  onChange={(event) => setEra(event.target.value as Era)}
                  disabled={isLoading}
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                >
                  {eras.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div>
              <p className="mb-3 text-sm font-medium">Discovery mode</p>

              <div className="grid gap-3 sm:grid-cols-3">
                {discoveryModes.map((item) => (
                  <Button
                    key={item.value}
                    type="button"
                    variant={discovery === item.value ? "default" : "outline"}
                    onClick={() => setDiscovery(item.value)}
                    disabled={isLoading}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        <label className="flex items-center justify-between gap-4 rounded-2xl border bg-background p-4">
          <div>
            <p className="text-sm font-medium">Allow explicit songs</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Include tracks marked as explicit.
            </p>
          </div>

          <input
            type="checkbox"
            checked={allowExplicit}
            onChange={(event) => setAllowExplicit(event.target.checked)}
            disabled={isLoading}
            className="h-5 w-5"
          />
        </label>

        <Button
          type="button"
          onClick={handleGenerate}
          disabled={isLoading}
          className="mt-auto"
        >
          {isLoading ? "Generating..." : "Get today's song"}
        </Button>
      </div>
    </section>
  );
}

export default ModeSelector;