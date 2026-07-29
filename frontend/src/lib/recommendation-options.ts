import type { Era, Genre, Mood } from "@/types/recommendation";

export const moods: { value: Mood; label: string }[] = [
  { value: "happy", label: "Happy" },
  { value: "chill", label: "Chill" },
  { value: "sad", label: "Sad" },
  { value: "energetic", label: "Energetic" },
  { value: "romantic", label: "Romantic" },
  { value: "focused", label: "Focused" },
];

export const genres: { value: Genre; label: string }[] = [
  { value: "pop", label: "Pop" },
  { value: "rock", label: "Rock" },
  { value: "hip-hop", label: "Hip-hop" },
  { value: "electronic", label: "Electronic" },
  { value: "jazz", label: "Jazz" },
  { value: "indie", label: "Indie" },
  { value: "metal", label: "Metal" },
  { value: "rnb", label: "R&B" },
  { value: "lofi", label: "Lo-fi" },
];

export const eras: { value: Era; label: string }[] = [
  { value: "any", label: "Any era" },
  { value: "new", label: "New releases" },
  { value: "2000s", label: "2000s" },
  { value: "2010s", label: "2010s" },
  { value: "2020s", label: "2020s" },
  { value: "oldies", label: "Oldies" },
];