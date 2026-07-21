import httpx
from fastapi import HTTPException

from app.core.config import settings


SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
SPOTIFY_SEARCH_URL = "https://api.spotify.com/v1/search"


def get_spotify_access_token() -> str:
    # Client Credentials Flow: used for backend-to-Spotify communication.
    if not settings.SPOTIFY_CLIENT_ID or not settings.SPOTIFY_CLIENT_SECRET:
        raise HTTPException(
            status_code=500,
            detail="Spotify credentials are not configured.",
        )

    response = httpx.post(
        SPOTIFY_TOKEN_URL,
        data={"grant_type": "client_credentials"},
        auth=(settings.SPOTIFY_CLIENT_ID, settings.SPOTIFY_CLIENT_SECRET),
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        timeout=10,
    )

    if response.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail={
                "message": "Failed to get Spotify access token.",
                "spotify_status_code": response.status_code,
                "spotify_response": response.text,
            },
        )

    data = response.json()

    return data["access_token"]


def test_spotify_connection() -> dict:
    # We only check whether token generation works.
    # The access token is intentionally not returned to the frontend.
    get_spotify_access_token()

    return {
        "spotify": "ok",
        "message": "Spotify access token generated successfully.",
    }


def search_spotify_tracks(
    query: str,
    limit: int = 10,
    offset: int = 0,
) -> list[dict]:
    # Search Spotify catalog for tracks matching a query.
    access_token = get_spotify_access_token()

    response = httpx.get(
        SPOTIFY_SEARCH_URL,
        params={
            "q": query,
            "type": "track",
            "market": "PL",
            "limit": limit,
            "offset": offset,
        },
        headers={
            "Authorization": f"Bearer {access_token}",
        },
        timeout=10,
    )

    if response.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail={
                "message": "Failed to search Spotify tracks.",
                "spotify_status_code": response.status_code,
                "spotify_response": response.text,
                "query": query,
            },
        )

    data = response.json()
    items = data.get("tracks", {}).get("items", [])

    return [map_spotify_track(item) for item in items]


def map_spotify_track(track: dict) -> dict:
    # Convert raw Spotify track data into a simplified shape used by our app.
    album = track.get("album", {})
    images = album.get("images", [])
    artists = track.get("artists", [])

    return {
        "id": track.get("id"),
        "title": track.get("name"),
        "artist": ", ".join(artist.get("name", "") for artist in artists),
        "album": album.get("name"),
        "spotifyUrl": track.get("external_urls", {}).get("spotify"),
        "coverUrl": images[0].get("url") if images else None,
        "explicit": track.get("explicit", False),
    }