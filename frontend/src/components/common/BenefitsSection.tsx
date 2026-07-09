import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const benefits = [
  {
    title: "Add songs to playlists",
    description: "Save your daily picks directly to Spotify.",
  },
  {
    title: "View history",
    description: "Check which songs SongRoulette picked for you before.",
  },
  {
    title: "See stats",
    description: "Discover your most common moods, genres and picks.",
  },
  {
    title: "Better personalization",
    description: "Use your Spotify taste to improve future recommendations.",
  },
];

function BenefitsSection() {
  return (
    <section className="mx-auto max-w-5xl space-y-6 py-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Unlock more with Spotify</h2>
        <p className="mt-2 text-muted-foreground">
          Generating songs is free without login. Spotify login only unlocks
          extra features.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {benefits.map((benefit) => (
          <Card key={benefit.title}>
            <CardHeader>
              <CardTitle className="text-base">{benefit.title}</CardTitle>
              <CardDescription>{benefit.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default BenefitsSection;