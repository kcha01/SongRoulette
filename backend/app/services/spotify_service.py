import httpx
from fastapi import HTTPException

from app.core.config import settings


SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"


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
            detail="Failed to get Spotify access token.",
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