from typing import Literal, Optional

from pydantic import BaseModel


class DailySongRequest(BaseModel):
    # Recommendation mode selected by the user.
    # "guided" means the user provides preferences.
    # "random" means the backend should pick something unexpected.
    mode: Literal["guided", "random"]

    # Anonymous browser identifier used before Spotify login.
    anonymousId: Optional[str] = None

    # Optional fields used only in guided recommendation mode.
    mood: Optional[str] = None
    genre: Optional[str] = None
    era: Optional[str] = None

    # Explicit songs are allowed by default.
    # This field is kept for backend compatibility, but it is no longer shown in the UI.
    allowExplicit: bool = True


class SongResponse(BaseModel):
    # Standard response shape returned to the frontend.
    id: str
    title: str
    artist: str
    album: str
    spotifyUrl: str
    coverUrl: Optional[str] = None
    tags: list[str]

    # True when the song was generated now, false when returned from today's saved pick.
    isNew: bool