import random
from datetime import date as date_type
from typing import Any

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.daily_song import DailySong
from app.schemas.recommendation import DailySongRequest, SongResponse
from app.services.spotify_service import search_spotify_tracks


MOOD_QUERY_MAP = {
    "happy": ["happy", "feel good", "summer", "dance"],
    "chill": ["chill", "relax", "lofi", "acoustic"],
    "sad": ["sad", "melancholy", "heartbreak", "ballad"],
    "energetic": ["workout", "party", "upbeat", "rock"],
    "romantic": ["love", "romantic", "rnb", "soul"],
    "focused": ["focus", "study", "instrumental", "ambient"],
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
    "music",
    "song",
    "life",
    "star",
    "gold",
]


def get_daily_song(db: Session, request: DailySongRequest) -> SongResponse:
    # If an anonymous browser identifier is provided, return today's saved song.
    today = date_type.today()

    if request.anonymousId:
        existing_song = get_existing_daily_song(
            db=db,
            anonymous_id=request.anonymousId,
            today=today,
        )

        if existing_song:
            return map_daily_song_to_response(existing_song)

    # No saved song for today, so generate a new one from Spotify.
    generated_song = generate_spotify_song(request)

    # Save the generated song only when we can identify the anonymous visitor.
    if request.anonymousId:
        save_daily_song(
            db=db,
            request=request,
            song=generated_song,
            today=today,
        )

    return generated_song


def get_existing_daily_song(
    db: Session,
    anonymous_id: str,
    today: date_type,
) -> DailySong | None:
    # Find today's song for an anonymous visitor.
    return (
        db.query(DailySong)
        .filter(
            DailySong.anonymous_id == anonymous_id,
            DailySong.date == today,
        )
        .first()
    )


def generate_spotify_song(request: DailySongRequest) -> SongResponse:
    # Generate a Spotify-based song recommendation.
    query_candidates = build_query_candidates(request)

    for query in query_candidates:
        tracks = search_spotify_tracks(
            query=query,
            limit=10,
            offset=0,
        )

        if not request.allowExplicit:
            tracks = [track for track in tracks if not track.get("explicit")]

        if tracks:
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

    raise HTTPException(
        status_code=404,
        detail={
            "message": "No matching Spotify tracks found after multiple attempts.",
            "queries": query_candidates,
        },
    )


def save_daily_song(
    db: Session,
    request: DailySongRequest,
    song: SongResponse,
    today: date_type,
) -> DailySong:
    # Save the generated song so the same visitor gets the same song today.
    criteria_json = request.model_dump(exclude_none=True)
    criteria_json.pop("anonymousId", None)

    daily_song = DailySong(
        anonymous_id=request.anonymousId,
        spotify_track_id=song.id,
        title=song.title,
        artist=song.artist,
        album=song.album,
        spotify_url=song.spotifyUrl,
        cover_url=song.coverUrl,
        mode=request.mode,
        criteria_json=criteria_json,
        date=today,
    )

    db.add(daily_song)
    db.commit()
    db.refresh(daily_song)

    return daily_song


def map_daily_song_to_response(song: DailySong) -> SongResponse:
    # Convert a saved database row into the response shape used by the frontend.
    return SongResponse(
        id=song.spotify_track_id,
        title=song.title,
        artist=song.artist,
        album=song.album or "",
        spotifyUrl=song.spotify_url,
        coverUrl=song.cover_url,
        tags=build_tags_from_criteria(song.mode, song.criteria_json or {}),
    )


def build_query_candidates(request: DailySongRequest) -> list[str]:
    # Build several Spotify Search queries so the endpoint can retry
    # when Spotify returns no useful tracks.
    if request.mode == "random":
        return random.sample(RANDOM_SEARCH_SEEDS, k=5)

    candidates: list[str] = []

    mood_queries = MOOD_QUERY_MAP.get(request.mood or "", [])
    base_mood_queries = mood_queries or ([request.mood] if request.mood else [])

    for mood_query in base_mood_queries:
        query_parts: list[str] = []

        if mood_query:
            query_parts.append(mood_query)

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

        if query_parts:
            candidates.append(" ".join(query_parts))

    # Fallbacks: progressively broader queries.
    if request.genre:
        candidates.append(request.genre)

    if request.mood:
        candidates.append(request.mood)

    candidates.extend(random.sample(RANDOM_SEARCH_SEEDS, k=3))

    # Remove duplicates while keeping order.
    unique_candidates = list(dict.fromkeys(candidates))

    return unique_candidates[:6]


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


def build_tags_from_criteria(mode: str, criteria: dict[str, Any]) -> list[str]:
    # Rebuild display tags from saved database criteria.
    if mode == "random":
        return [
            "Surprise me",
            "Explicit allowed" if criteria.get("allowExplicit") else "Clean",
        ]

    tags = []

    for key in ["mood", "genre", "discovery", "era"]:
        value = criteria.get(key)

        if value:
            tags.append(str(value))

    tags.append("Explicit allowed" if criteria.get("allowExplicit") else "Clean")

    return tags