import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function SongResultCard() {
  return (
    <Card className="mx-auto max-w-3xl overflow-hidden">
      <CardHeader>
        <CardTitle>Your song will appear here</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-6 md:grid-cols-[180px_1fr]">
          <div className="flex aspect-square items-center justify-center rounded-xl border border-border bg-muted text-sm text-muted-foreground">
            Album cover
          </div>

          <div className="flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <div>
                <h3 className="text-2xl font-bold">Song title</h3>
                <p className="text-muted-foreground">Artist name</p>
                <p className="text-sm text-muted-foreground">Album name</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Chill</Badge>
                <Badge variant="secondary">Indie</Badge>
                <Badge variant="secondary">Balanced</Badge>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button>Open in Spotify</Button>
              <Button variant="outline">Add to playlist 🔒</Button>
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