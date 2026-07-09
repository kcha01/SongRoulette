import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Song } from "@/types/recommendation";

type SongResultCardProps = {
  song: Song | null;
};

function SongResultCard({ song }: SongResultCardProps) {
  return (
    <Card className="mx-auto max-w-3xl overflow-hidden">
      <CardHeader>
        <CardTitle>
          {song ? "Today's pick" : "Your song will appear here"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-6 md:grid-cols-[180px_1fr]">
          {song?.coverUrl ? (
            <img
              src={song.coverUrl}
              alt={`${song.album} album cover`}
              className="aspect-square rounded-xl object-cover"
            />
          ) : (
            <div className="flex aspect-square items-center justify-center rounded-xl border border-border bg-muted text-sm text-muted-foreground">
              Album cover
            </div>
          )}

          <div className="flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <div>
                <h3 className="text-2xl font-bold">
                  {song?.title ?? "Song title"}
                </h3>
                <p className="text-muted-foreground">
                  {song?.artist ?? "Artist name"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {song?.album ?? "Album name"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {(song?.tags ?? ["Chill", "Indie", "Balanced"]).map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button disabled={!song}>Open in Spotify</Button>
              <Button variant="outline" disabled={!song}>
                Add to playlist 🔒
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Login required to add this song to your Spotify playlist.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SongResultCard;