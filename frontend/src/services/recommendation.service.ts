import type { RecommendationRequest, Song } from "@/types/recommendation";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export async function getDailySong(
  request: RecommendationRequest
): Promise<Song> {
  const response = await fetch(`${API_URL}/songs/daily`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("Failed to generate daily song");
  }

  return response.json();
}