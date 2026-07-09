import { Button } from "@/components/ui/button";

function HeroSection() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 py-16 text-center">
      <div className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
        No login required to generate a song
      </div>

      <div className="space-y-4">
        <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
          Find your song for today.
        </h1>

        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Choose your vibe or let SongRoulette surprise you with a random
          Spotify track.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg">Choose my vibe</Button>
        <Button size="lg" variant="secondary">
          Surprise me
        </Button>
      </div>
    </section>
  );
}

export default HeroSection;