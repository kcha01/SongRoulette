import random

from app.schemas.recommendation import DailySongRequest, SongResponse


MOCK_SONGS = [
    {
        "id": "1",
        "title": "Midnight City",
        "artist": "M83",
        "album": "Hurry Up, We're Dreaming",
        "spotifyUrl": "https://open.spotify.com",
    },
    {
        "id": "2",
        "title": "Do I Wanna Know?",
        "artist": "Arctic Monkeys",
        "album": "AM",
        "spotifyUrl": "https://open.spotify.com",
    },
    {
        "id": "3",
        "title": "Sweet Disposition",
        "artist": "The Temper Trap",
        "album": "Conditions",
        "spotifyUrl": "https://open.spotify.com",
    },
]


def get_daily_song(request: DailySongRequest) -> SongResponse:
    song = random.choice(MOCK_SONGS)

    if request.mode == "random":
        tags = [
            "Surprise me",
            "Explicit allowed" if request.allowExplicit else "Clean",
        ]
    else:
        tags = [
            request.mood or "Mood",
            request.genre or "Genre",
            request.discovery or "Discovery",
            request.era or "Any time",
            "Explicit allowed" if request.allowExplicit else "Clean",
        ]

    return SongResponse(
        id=song["id"],
        title=song["title"],
        artist=song["artist"],
        album=song["album"],
        spotifyUrl=song["spotifyUrl"],
        tags=tags,
    )