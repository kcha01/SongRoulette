from fastapi import APIRouter, HTTPException, Query

from app.core.config import settings
from app.services.spotify_service import (
    search_spotify_tracks,
    test_spotify_connection,
)


router = APIRouter(
    prefix="/spotify",
    tags=["spotify"],
)


def block_spotify_dev_endpoint_in_production() -> None:
    # Spotify test endpoints are useful locally, but should not be public in production.
    if settings.is_production:
        raise HTTPException(status_code=404, detail="Not found")


@router.get("/health")
def spotify_health():
    # Test endpoint used to verify Spotify API credentials.
    block_spotify_dev_endpoint_in_production()

    return test_spotify_connection()


@router.get("/search-test")
def spotify_search_test(
    q: str = Query(..., min_length=1),
    limit: int = Query(5, ge=1, le=10),
):
    # Temporary endpoint used to verify Spotify Search API integration.
    block_spotify_dev_endpoint_in_production()

    return {
        "query": q,
        "tracks": search_spotify_tracks(q, limit),
    }