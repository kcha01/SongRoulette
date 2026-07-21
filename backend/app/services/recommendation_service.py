import random

from fastapi import HTTPException

from app.schemas.recommendation import DailySongRequest, SongResponse
from app.services.spotify_service import search_spotify_tracks


MOOD_QUERY_MAP = {
    "happy": ["happy", "feel good", "summer"],
    "chill": ["chill", "relax", "lofi"],
    "sad": ["sad", "melancholy", "heartbreak"],
    "energetic": ["workout", "party", "upbeat"],
    "romantic": ["love", "romantic", "rnb"],
    "focused": ["focus", "study", "instrumental"],
}

ERA_QUERY_MAP = {
    "new": "year:2024-2026",
    "2000s": "year:2000-2009",
    "2010s": "year:2010-2019",
    "2020s": "year:2020-2026",
    "oldies": "year:1950-1999",
}

RANDOM_SEARCH_SEEDS = [
    "love",
    "night",
    "dream",
    "summer",
    "rain",
    "fire",
    "moon",
    "blue",
    "dance",
    "heart",
    "home",
    "road",
    "light",
    "city",
    "ocean",
    "sound",
    "time",
    "young",
]


def get_daily_song(request: DailySongRequest) -> SongResponse:
    # Generate a Spotify-based song recommendation.
    query = build_spotify_query(request)

    # Temporary fixed offset for debugging.
    # Random offset will be restored after the Spotify query is stable.
    offset = 0

    tracks = search_spotify_tracks(
        query=query,
        limit=10,
        offset=offset,
    )

    if not request.allowExplicit:
        tracks = [track for track in tracks if not track.get("explicit")]

    if not tracks:
        raise HTTPException(
            status_code=404,
            detail={
                "message": "No matching Spotify tracks found.",
                "query": query,
            },
        )

    selected_track = random.choice(tracks)

    return SongResponse(
        id=selected_track["id"],
        title=selected_track["title"],
        artist=selected_track["artist"],
        album=selected_track["album"],
        spotifyUrl=selected_track["spotifyUrl"],
        coverUrl=selected_track.get("coverUrl"),
        tags=build_tags(request),
    )


def build_spotify_query(request: DailySongRequest) -> str:
    # Build a simple Spotify Search query from user preferences.
    if request.mode == "random":
        return random.choice(RANDOM_SEARCH_SEEDS)

    query_parts: list[str] = []

    if request.mood:
        mood_queries = MOOD_QUERY_MAP.get(request.mood, [request.mood])
        query_parts.append(random.choice(mood_queries))

    if request.genre:
        query_parts.append(request.genre)

    if request.discovery == "hidden-gems":
        query_parts.append("indie")
    elif request.discovery == "popular":
        query_parts.append("hits")

    if request.era and request.era != "any":
        era_query = ERA_QUERY_MAP.get(request.era)

        if era_query:
            query_parts.append(era_query)

    if not query_parts:
        return random.choice(RANDOM_SEARCH_SEEDS)

    return " ".join(query_parts)


def build_tags(request: DailySongRequest) -> list[str]:
    # Build display tags shown on the frontend.
    if request.mode == "random":
        return [
            "Surprise me",
            "Explicit allowed" if request.allowExplicit else "Clean",
        ]

    tags = []

    if request.mood:
        tags.append(request.mood)

    if request.genre:
        tags.append(request.genre)

    if request.discovery:
        tags.append(request.discovery)

    if request.era:
        tags.append(request.era)

    tags.append("Explicit allowed" if request.allowExplicit else "Clean")

    return tags