from typing import Literal, Optional

from pydantic import BaseModel


class DailySongRequest(BaseModel):
    mode: Literal["guided", "random"]
    mood: Optional[str] = None
    genre: Optional[str] = None
    discovery: Optional[str] = None
    era: Optional[str] = None
    allowExplicit: bool = False


class SongResponse(BaseModel):
    id: str
    title: str
    artist: str
    album: str
    spotifyUrl: str
    tags: list[str]