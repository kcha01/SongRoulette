export type RecommendationMode = "guided" | "random";

export type Mood =
  | "happy"
  | "chill"
  | "sad"
  | "energetic"
  | "romantic"
  | "focused";

export type Genre =
  | "pop"
  | "rock"
  | "hip-hop"
  | "electronic"
  | "jazz"
  | "indie"
  | "metal"
  | "rnb"
  | "lofi";

export type DiscoveryMode = "popular" | "balanced" | "hidden-gems";

export type Era =
  | "any"
  | "new"
  | "2000s"
  | "2010s"
  | "2020s"
  | "oldies";

export type RecommendationRequest =
  | {
      mode: "guided";
      mood: Mood;
      genre: Genre;
      discovery: DiscoveryMode;
      era: Era;
      allowExplicit: boolean;
    }
  | {
      mode: "random";
      allowExplicit: boolean;
    };

export type Song = {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl?: string;
  spotifyUrl: string;
  tags: string[];
};