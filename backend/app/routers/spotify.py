from fastapi import APIRouter, Query

from app.services.spotify_service import (
    search_spotify_tracks,
    test_spotify_connection,
)


router = APIRouter(
    prefix="/spotify",
    tags=["spotify"],
)


@router.get("/health")
def spotify_health():
    # Test endpoint used to verify Spotify API credentials.
    return test_spotify_connection()


@router.get("/search-test")
def spotify_search_test(
    q: str = Query(..., min_length=1),
    limit: int = Query(5, ge=1, le=10),
):
    # Temporary endpoint used to verify Spotify Search API integration.
    return {
        "query": q,
        "tracks": search_spotify_tracks(q, limit),
    }