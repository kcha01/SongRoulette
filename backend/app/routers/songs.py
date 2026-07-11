from fastapi import APIRouter

from app.schemas.recommendation import DailySongRequest, SongResponse
from app.services.recommendation_service import get_daily_song

router = APIRouter(
    prefix="/songs",
    tags=["songs"],
)


@router.post("/daily", response_model=SongResponse)
def create_daily_song(request: DailySongRequest):
    return get_daily_song(request)