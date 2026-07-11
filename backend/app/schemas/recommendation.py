from typing import Literal, Optional

from pydantic import BaseModel


class DailySongRequest(BaseModel):
    # Recommendation mode selected by the user.
    # "guided" means the user provides preferences.
    # "random" means the backend should pick something unexpected.
    mode: Literal["guided", "random"]

    # Optional fields used only in guided recommendation mode.
    mood: Optional[str] = None
    genre: Optional[str] = None
    discovery: Optional[str] = None
    era: Optional[str] = None

    # Defines whether explicit songs can be included in the result.
    allowExplicit: bool = False


class SongResponse(BaseModel):
    # Standard response shape returned to the frontend.
    id: str
    title: str
    artist: str
    album: str
    spotifyUrl: str
    tags: list[str]