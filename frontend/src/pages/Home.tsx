function Home() {
  return (
    <section className="space-y-4">
      <p className="text-sm font-medium text-muted-foreground">
        Daily music recommendation
      </p>

      <h1 className="text-4xl font-bold tracking-tight">
        Find one song for today.
      </h1>

      <p className="max-w-xl text-muted-foreground">
        Choose your mood and genre, then SongRoulette will pick one track for
        you.
      </p>
    </section>
  );
}

export default Home;