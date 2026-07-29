import random
from datetime import date as date_type
from typing import Any

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.daily_song import DailySong
from app.schemas.recommendation import DailySongRequest, SongResponse
from app.services.spotify_service import search_spotify_tracks


MOOD_QUERY_MAP = {
    "happy": ["feel good", "upbeat", "summer", "dance", "party"],
    "chill": ["chill", "relax", "lofi", "acoustic"],
    "sad": ["sad", "melancholy", "heartbreak", "emotional"],
    "energetic": ["hype", "party", "upbeat", "energy", "dance"],
    "romantic": ["love", "romantic", "rnb", "soul"],
    "focused": ["focus", "study", "instrumental", "ambient"],
}

GENRE_QUERY_MAP = {
    "pop": "pop",
    "rock": "rock",
    "hip-hop": "hip hop",
    "electronic": "electronic",
    "jazz": "jazz",
    "indie": "indie",
    "metal": "metal",
    "rnb": "r&b",
    "lofi": "lofi",
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

MOOD_EXCLUDED_KEYWORDS = {
    "happy": [
        "sad",
        "cry",
        "tears",
        "lonely",
        "alone",
        "heartbreak",
        "pain",
        "without you",
        "don't wanna live",
        "dont wanna live",
        "i don't wanna live",
        "i dont wanna live",
        "broken",
        "depressed",
        "depression",
    ],
    "energetic": [
        "sleep",
        "lullaby",
        "sad piano",
        "ambient sleep",
    ],
}

LOW_QUALITY_COMMON_KEYWORDS = [
    "karaoke",
    "tribute",
    "cover",
    "cover version",
    "sped up",
    "slowed",
    "nightcore",
    "8d",
    "reverb",
    "remix",
    "instrumental version",
    "piano version",
    "acoustic version",
    "made famous by",
    "tv mix",
    "vocal",
    "instrumental",
    "party tyme",
    "hitmakers",
    "sound tower",
    "speed tower",
    "lo-fi aimbients",
    "lofi",
    "lo-fi",
    "type beat",
    "beats",
    "beat",
    "background",
    "study music",
    "sleep",
    "meditation",
    "rain sounds",
    "white noise",
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

    tracks = collect_tracks_from_spotify_queries(
        query_candidates=query_candidates,
        allow_explicit=request.allowExplicit,
    )

    tracks = filter_tracks_for_request(tracks, request)
    selected_track = select_track(tracks)

    if not selected_track:
        raise HTTPException(
            status_code=404,
            detail={
                "code": "NO_SONG_FOUND",
                "message": "No matching Spotify tracks found after multiple attempts.",
                "queries": query_candidates,
            },
        )

    return SongResponse(
        id=selected_track["id"],
        title=selected_track["title"],
        artist=selected_track["artist"],
        album=selected_track["album"] or "",
        spotifyUrl=selected_track["spotifyUrl"],
        coverUrl=selected_track.get("coverUrl"),
        tags=build_tags(request),
        isNew=True,
    )


def collect_tracks_from_spotify_queries(
    query_candidates: list[str],
    allow_explicit: bool,
) -> list[dict]:
    # Search Spotify using multiple queries and collect unique tracks.
    collected_tracks: list[dict] = []

    for query_rank, query in enumerate(query_candidates):
        tracks = search_spotify_tracks(
            query=query,
            limit=10,
            offset=0,
        )

        if not allow_explicit:
            tracks = [track for track in tracks if not track.get("explicit")]

        for track in tracks:
            collected_tracks.append(
                {
                    **track,
                    "_queryRank": query_rank,
                    "_sourceQuery": query,
                },
            )

    return remove_duplicate_tracks(collected_tracks)


def remove_duplicate_tracks(tracks: list[dict]) -> list[dict]:
    # Remove duplicated Spotify tracks while keeping the first occurrence.
    unique_tracks: list[dict] = []
    seen_track_ids: set[str] = set()

    for track in tracks:
        track_id = track.get("id")

        if not track_id:
            continue

        if track_id in seen_track_ids:
            continue

        seen_track_ids.add(track_id)
        unique_tracks.append(track)

    return unique_tracks


def filter_tracks_for_request(
    tracks: list[dict],
    request: DailySongRequest,
) -> list[dict]:
    # Apply additional app-level filtering because Spotify Search is not a mood engine.
    filtered_tracks: list[dict] = []

    for track in tracks:
        if not matches_selected_era(track, request):
            continue

        if not matches_basic_mood_sanity(track, request):
            continue

        if is_low_quality_track(track):
            continue

        filtered_tracks.append(track)

    return filtered_tracks


def matches_selected_era(
    track: dict,
    request: DailySongRequest,
) -> bool:
    if request.mode != "guided":
        return True

    if not request.era or request.era == "any":
        return True

    release_year = get_track_release_year(track)

    if release_year is None:
        return False

    current_year = date_type.today().year

    if request.era == "new":
        return current_year - 1 <= release_year <= current_year

    if request.era == "2000s":
        return 2000 <= release_year <= 2009

    if request.era == "2010s":
        return 2010 <= release_year <= 2019

    if request.era == "2020s":
        return 2020 <= release_year <= current_year

    if request.era == "oldies":
        return release_year <= 1999

    return True


def get_track_release_year(track: dict) -> int | None:
    release_date = track.get("releaseDate")

    if not release_date:
        return None

    try:
        return int(str(release_date)[:4])
    except ValueError:
        return None


def matches_basic_mood_sanity(
    track: dict,
    request: DailySongRequest,
) -> bool:
    if request.mode != "guided":
        return True

    if not request.mood:
        return True

    excluded_keywords = MOOD_EXCLUDED_KEYWORDS.get(request.mood, [])

    if not excluded_keywords:
        return True

    searchable_text = get_track_searchable_text(track)

    return not any(keyword in searchable_text for keyword in excluded_keywords)


def is_low_quality_track(track: dict) -> bool:
    # Remove tracks that are usually bad recommendations.
    searchable_text = get_track_searchable_text(track)

    return any(keyword in searchable_text for keyword in LOW_QUALITY_COMMON_KEYWORDS)


def get_track_searchable_text(track: dict) -> str:
    title = str(track.get("title") or "").lower()
    album = str(track.get("album") or "").lower()
    artist = str(track.get("artist") or "").lower()

    return f"{title} {album} {artist}"


def select_track(tracks: list[dict]) -> dict | None:
    # Pick from better-ranked Spotify results while keeping a roulette feeling.
    if not tracks:
        return None

    sorted_tracks = sorted(
        tracks,
        key=lambda track: track.get("_queryRank", 999),
    )

    candidate_pool = sorted_tracks[:15]

    return random.choice(candidate_pool)


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
        isNew=False,
    )


def build_query_candidates(request: DailySongRequest) -> list[str]:
    # Build several Spotify Search queries.
    if request.mode == "random":
        return random.sample(RANDOM_SEARCH_SEEDS, k=5)

    mood_queries = MOOD_QUERY_MAP.get(request.mood or "", [])
    base_mood_queries = mood_queries or ([request.mood] if request.mood else [])
    genre_query = get_genre_query(request)
    era_query = get_era_query(request)

    return build_guided_query_candidates(
        mood_queries=base_mood_queries,
        genre_query=genre_query,
        era_query=era_query,
    )


def build_guided_query_candidates(
    mood_queries: list[str],
    genre_query: str | None,
    era_query: str | None,
) -> list[str]:
    candidates: list[str] = []

    for mood_query in mood_queries:
        if mood_query and genre_query and era_query:
            candidates.append(f"{mood_query} {genre_query} {era_query}")

        if mood_query and genre_query:
            candidates.append(f"{mood_query} {genre_query}")

        if mood_query and era_query:
            candidates.append(f"{mood_query} {era_query}")

        if mood_query:
            candidates.append(mood_query)

    if genre_query and era_query:
        candidates.append(f"{genre_query} {era_query}")

    if genre_query:
        candidates.append(genre_query)

    return unique_limited_candidates(candidates, limit=10)


def get_genre_query(request: DailySongRequest) -> str | None:
    if not request.genre:
        return None

    return GENRE_QUERY_MAP.get(request.genre, request.genre)


def get_era_query(request: DailySongRequest) -> str | None:
    if not request.era or request.era == "any":
        return None

    current_year = date_type.today().year

    if request.era == "new":
        return f"year:{current_year - 1}-{current_year}"

    if request.era == "2000s":
        return "year:2000-2009"

    if request.era == "2010s":
        return "year:2010-2019"

    if request.era == "2020s":
        return f"year:2020-{current_year}"

    if request.era == "oldies":
        return "year:1950-1999"

    return None


def unique_limited_candidates(
    candidates: list[str],
    limit: int,
) -> list[str]:
    # Remove duplicated queries while keeping order.
    unique_candidates = list(dict.fromkeys(candidates))

    return unique_candidates[:limit]


def build_tags(request: DailySongRequest) -> list[str]:
    # Build display tags shown on the frontend.
    if request.mode == "random":
        return ["Surprise me"]

    tags = []

    if request.mood:
        tags.append(request.mood)

    if request.genre:
        tags.append(request.genre)

    if request.era:
        tags.append(request.era)

    return tags


def build_tags_from_criteria(mode: str, criteria: dict[str, Any]) -> list[str]:
    # Rebuild display tags from saved database criteria.
    if mode == "random":
        return ["Surprise me"]

    tags = []

    for key in ["mood", "genre", "era"]:
        value = criteria.get(key)

        if value:
            tags.append(str(value))

    return tags