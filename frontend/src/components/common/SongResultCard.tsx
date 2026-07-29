import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Song } from "@/types/recommendation";

type SongResultCardProps = {
  song: Song | null;
};

function SongResultCard({ song }: SongResultCardProps) {
  return (
    <section className="h-full rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
      <div className="flex h-full flex-col gap-6">
        <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-muted">
          {song?.coverUrl ? (
            <img
              src={song.coverUrl}
              alt={`${song.album || song.title} album cover`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="px-6 text-center">
              <p className="text-5xl">🎧</p>

              <p className="mt-4 text-sm font-medium">
                Your daily song will appear here
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                Generate your first pick to reveal today&apos;s track.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Today&apos;s pick
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              {song?.title ?? "No song generated yet"}
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              {song
                ? `${song.artist} · ${song.album}`
                : "Your result will be shown here."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {(song?.tags ?? ["Daily", "Spotify", "Discovery"]).map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          {song && (
            <div className="rounded-2xl border bg-muted/40 p-4 text-sm text-muted-foreground">
              {song.isNew
                ? "New song generated for today."
                : "This is your song for today. Come back tomorrow for a new pick."}
            </div>
          )}
        </div>

        <div className="mt-auto grid gap-3">
          <Button
            disabled={!song}
            onClick={() => {
              if (song) {
                window.open(song.spotifyUrl, "_blank", "noopener,noreferrer");
              }
            }}
          >
            Open in Spotify
          </Button>

          <Button disabled variant="outline">
            Add to playlist · Coming soon
          </Button>
        </div>
      </div>
    </section>
  );
}

export default SongResultCard;