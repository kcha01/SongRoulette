import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Song } from "@/types/recommendation";

type SongResultCardProps = {
  song: Song | null;
};

function SongResultCard({ song }: SongResultCardProps) {
  return (
    <section className="mx-auto max-w-3xl rounded-2xl border bg-card p-6 shadow-sm">
      <div className="grid gap-6 md:grid-cols-[180px_1fr]">
        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-muted">
          {song?.coverUrl ? (
            <img
              src={song.coverUrl}
              alt={`${song.album} album cover`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="px-4 text-center text-sm text-muted-foreground">
              Your daily song will appear here
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Today&apos;s pick
              </p>

              <h2 className="mt-1 text-2xl font-bold tracking-tight">
                {song?.title ?? "No song generated yet"}
              </h2>

              <p className="mt-2 text-muted-foreground">
                {song
                  ? `${song.artist} · ${song.album}`
                  : "Choose your mode and generate your first SongRoulette pick."}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {(song?.tags ?? ["Mood", "Genre", "Discovery"]).map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            {song && (
              <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
                {song.isNew
                  ? "New song generated for today."
                  : "This is your song for today. Come back tomorrow for a new pick."}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              disabled={!song}
              onClick={() => {
                if (song) {
                  window.open(
                    song.spotifyUrl,
                    "_blank",
                    "noopener,noreferrer",
                  );
                }
              }}
            >
              Open in Spotify
            </Button>

            <Button disabled variant="outline">
              Add to playlist
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SongResultCard;