from fastapi import APIRouter

from app.schemas.recommendation import DailySongRequest, SongResponse
from app.services.recommendation_service import get_daily_song

# Router responsible for song-related API endpoints.
router = APIRouter(
    prefix="/songs",
    tags=["songs"],
)


@router.post("/daily", response_model=SongResponse)
def create_daily_song(request: DailySongRequest):
    # Generate or retrieve the user's daily song recommendation.
    return get_daily_song(request)