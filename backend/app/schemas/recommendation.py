from typing import Literal, Optional

from pydantic import BaseModel, Field


class DailySongRequest(BaseModel):
    # Recommendation mode selected by the user.
    # "guided" means the user provides preferences.
    # "random" means the backend should pick something unexpected.
    mode: Literal["guided", "random"]

    # Anonymous browser identifier used before Spotify login.
    # The frontend generates it with crypto.randomUUID().
    anonymousId: Optional[str] = Field(
        default=None,
        min_length=8,
        max_length=64,
        pattern=r"^[a-zA-Z0-9_-]+$",
    )

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