const benefits = [
  {
    title: "Instant discovery",
    description:
      "Generate a daily recommendation without creating an account or connecting Spotify.",
  },
  {
    title: "Personalized filters",
    description:
      "Use mood, genre, discovery mode, era, and explicit content preference to shape the result.",
  },
  {
    title: "Built for growth",
    description:
      "Spotify login, history, playlists, statistics, and premium features are planned for future versions.",
  },
];

function BenefitsSection() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {benefits.map((benefit) => (
        <article
          key={benefit.title}
          className="rounded-3xl border bg-card p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold">{benefit.title}</h3>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {benefit.description}
          </p>
        </article>
      ))}
    </section>
  );
}

export default BenefitsSection;