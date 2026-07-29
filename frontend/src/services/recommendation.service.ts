import type { RecommendationRequest, Song } from "@/types/recommendation";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

type ApiErrorDetail = {
  code?: string;
  message?: string;
  retryAfterSeconds?: number;
};

type ApiErrorResponse = {
  detail?: string | ApiErrorDetail;
};

export class DailySongApiError extends Error {
  code?: string;
  retryAfterSeconds?: number;

  constructor(message: string, code?: string, retryAfterSeconds?: number) {
    super(message);
    this.name = "DailySongApiError";
    this.code = code;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export async function getDailySong(
  request: RecommendationRequest,
): Promise<Song> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}/songs/daily`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });
  } catch {
    throw new DailySongApiError(
      "Cannot connect to the server. Make sure the backend is running and try again.",
    );
  }

  if (!response.ok) {
    const errorResponse = await readErrorResponse(response);
    const detail = errorResponse?.detail;

    const code =
      typeof detail === "object" && detail !== null ? detail.code : undefined;

    const retryAfterSeconds =
      typeof detail === "object" && detail !== null
        ? detail.retryAfterSeconds
        : undefined;

    throw new DailySongApiError(
      getDailySongErrorMessage(response.status, errorResponse),
      code,
      retryAfterSeconds,
    );
  }

  return response.json();
}

async function readErrorResponse(
  response: Response,
): Promise<ApiErrorResponse | null> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function getDailySongErrorMessage(
  status: number,
  errorResponse: ApiErrorResponse | null,
): string {
  const detail = errorResponse?.detail;

  const errorCode =
    typeof detail === "object" && detail !== null ? detail.code : undefined;

  if (errorCode === "RATE_LIMIT_EXCEEDED" || status === 429) {
    return "Too many requests. Please wait a moment and try again.";
  }

  if (errorCode === "NO_SONG_FOUND" || status === 404) {
    return "We couldn't find a song for these filters. Try changing your mood or genre.";
  }

    if (errorCode === "SPOTIFY_RATE_LIMITED" || status === 503) {
    return "Spotify is busy right now. Please wait a moment and try again.";
  }

  if (
    errorCode === "SPOTIFY_SEARCH_FAILED" ||
    errorCode === "SPOTIFY_TOKEN_FAILED" ||
    status === 502
  ) {
    return "Spotify is temporarily unavailable. Please try again in a moment.";
  }

  if (errorCode === "SPOTIFY_CONFIG_MISSING" || status === 500) {
    return "The server is not configured correctly. Please check backend environment variables.";
  }

  if (status === 422) {
    return "Some recommendation options are invalid. Please refresh the page and try again.";
  }

  if (typeof detail === "string") {
    return detail;
  }

  if (typeof detail === "object" && detail?.message) {
    return detail.message;
  }

  return "Something went wrong while generating your song.";
}