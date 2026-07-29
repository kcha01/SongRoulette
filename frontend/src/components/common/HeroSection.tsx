import { Badge } from "@/components/ui/badge";

function HeroSection() {
  return (
    <section className="overflow-hidden rounded-3xl border bg-card p-8 shadow-sm sm:p-10 lg:p-12">
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div className="space-y-5">
          <Badge variant="secondary" className="w-fit">
            Spotify-powered daily discovery
          </Badge>

          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Discover one Spotify song every day.
            </h1>

            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              SongRoulette gives you one daily recommendation. Choose your mood,
              pick a genre, or let the app surprise you with a random track.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <div className="rounded-2xl border bg-background p-4">
            <p className="text-sm font-semibold">No login required</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Start instantly.
            </p>
          </div>

          <div className="rounded-2xl border bg-background p-4">
            <p className="text-sm font-semibold">Real Spotify tracks</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Powered by Spotify API.
            </p>
          </div>

          <div className="rounded-2xl border bg-background p-4">
            <p className="text-sm font-semibold">One pick per day</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Come back tomorrow.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;