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

const moods = ["Happy", "Chill", "Sad", "Energetic", "Romantic", "Focused"];

function ModeSelector() {
  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader>
        <CardTitle>How do you want to find today&apos;s song?</CardTitle>
        <CardDescription>
          Pick your vibe or let SongRoulette choose something unexpected.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="guided" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="guided">🎯 Choose my vibe</TabsTrigger>
            <TabsTrigger value="random">🎲 Surprise me</TabsTrigger>
          </TabsList>

          <TabsContent value="guided" className="space-y-6">
            <div className="space-y-3">
              <Label>Mood</Label>

              <div className="flex flex-wrap gap-2">
                {moods.map((mood) => (
                  <Button key={mood} type="button" variant="outline">
                    {mood}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <Label>Genre</Label>

                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose genre" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="pop">Pop</SelectItem>
                    <SelectItem value="rock">Rock</SelectItem>
                    <SelectItem value="hip-hop">Hip-hop</SelectItem>
                    <SelectItem value="electronic">Electronic</SelectItem>
                    <SelectItem value="jazz">Jazz</SelectItem>
                    <SelectItem value="indie">Indie</SelectItem>
                    <SelectItem value="metal">Metal</SelectItem>
                    <SelectItem value="rnb">R&B</SelectItem>
                    <SelectItem value="lofi">Lo-fi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Era</Label>

                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Any time" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="any">Any time</SelectItem>
                    <SelectItem value="new">New music</SelectItem>
                    <SelectItem value="2000s">2000s</SelectItem>
                    <SelectItem value="2010s">2010s</SelectItem>
                    <SelectItem value="2020s">2020s</SelectItem>
                    <SelectItem value="oldies">Oldies</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Discovery mode</Label>

              <div className="grid gap-2 sm:grid-cols-3">
                <Button type="button" variant="outline">
                  Popular
                </Button>
                <Button type="button" variant="default">
                  Balanced
                </Button>
                <Button type="button" variant="outline">
                  Hidden gems
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="space-y-1">
                <Label>Allow explicit songs</Label>
                <p className="text-sm text-muted-foreground">
                  Include tracks marked as explicit.
                </p>
              </div>

              <Switch />
            </div>

            <Button className="w-full" size="lg">
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

              <Switch />
            </div>

            <Button className="w-full" size="lg">
              Surprise me
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default ModeSelector;