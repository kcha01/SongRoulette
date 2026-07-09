import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  discoveryModes,
  eras,
  genres,
  moods,
} from "@/lib/recommendation-options";
import type {
  DiscoveryMode,
  Era,
  Genre,
  Mood,
  RecommendationMode,
  RecommendationRequest,
} from "@/types/recommendation";

type ModeSelectorProps = {
  onGenerate: (request: RecommendationRequest) => void;
};

function ModeSelector({ onGenerate }: ModeSelectorProps) {
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
    <Card className="mx-auto max-w-3xl">
      <CardHeader>
        <CardTitle>How do you want to find today&apos;s song?</CardTitle>
        <CardDescription>
          Pick your vibe or let SongRoulette choose something unexpected.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs
          value={mode}
          onValueChange={(value) => setMode(value as RecommendationMode)}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="guided">🎯 Choose my vibe</TabsTrigger>
            <TabsTrigger value="random">🎲 Surprise me</TabsTrigger>
          </TabsList>

          <TabsContent value="guided" className="space-y-6">
            <div className="space-y-3">
              <Label>Mood</Label>

              <div className="flex flex-wrap gap-2">
                {moods.map((item) => (
                  <Button
                    key={item.value}
                    type="button"
                    variant={mood === item.value ? "default" : "outline"}
                    onClick={() => setMood(item.value)}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <Label>Genre</Label>

                <Select
                  value={genre}
                  onValueChange={(value) => setGenre(value as Genre)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose genre" />
                  </SelectTrigger>

                  <SelectContent>
                    {genres.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Era</Label>

                <Select value={era} onValueChange={(value) => setEra(value as Era)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any time" />
                  </SelectTrigger>

                  <SelectContent>
                    {eras.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Discovery mode</Label>

              <div className="grid gap-2 sm:grid-cols-3">
                {discoveryModes.map((item) => (
                  <Button
                    key={item.value}
                    type="button"
                    variant={discovery === item.value ? "default" : "outline"}
                    onClick={() => setDiscovery(item.value)}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="space-y-1">
                <Label>Allow explicit songs</Label>
                <p className="text-sm text-muted-foreground">
                  Include tracks marked as explicit.
                </p>
              </div>

              <Switch
                checked={allowExplicit}
                onCheckedChange={setAllowExplicit}
              />
            </div>

            <Button className="w-full" size="lg" onClick={handleGenerate}>
              Get today&apos;s song
            </Button>
          </TabsContent>

          <TabsContent value="random" className="space-y-6">
            <div className="rounded-lg border border-border bg-muted/40 p-6 text-center">
              <h3 className="text-xl font-semibold">No filters.</h3>
              <p className="mt-2 text-muted-foreground">
                Just pure randomness. SongRoulette will pick something
                unexpected for you.
              </p>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="space-y-1">
                <Label>Allow explicit songs</Label>
                <p className="text-sm text-muted-foreground">
                  Include tracks marked as explicit.
                </p>
              </div>

              <Switch
                checked={allowExplicit}
                onCheckedChange={setAllowExplicit}
              />
            </div>

            <Button className="w-full" size="lg" onClick={handleGenerate}>
              Surprise me
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default ModeSelector;