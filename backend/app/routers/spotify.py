from fastapi import APIRouter

from app.services.spotify_service import test_spotify_connection


router = APIRouter(
    prefix="/spotify",
    tags=["spotify"],
)


@router.get("/health")
def spotify_health():
    # Test endpoint used to verify Spotify API credentials.
    return test_spotify_connection()