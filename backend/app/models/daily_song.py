from datetime import date as date_type, datetime
from typing import Any, Optional

from sqlalchemy import (
    CheckConstraint,
    Date,
    DateTime,
    ForeignKey,
    Index,
    String,
    Text,
    func,
    text,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class DailySong(Base):
    # Stores one generated song for a logged-in user or anonymous visitor per day.
    __tablename__ = "daily_songs"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )
    anonymous_id: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
        index=True,
    )

    spotify_track_id: Mapped[str] = mapped_column(String(255), nullable=False)

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    artist: Mapped[str] = mapped_column(String(255), nullable=False)
    album: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    spotify_url: Mapped[str] = mapped_column(Text, nullable=False)
    cover_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    mode: Mapped[str] = mapped_column(String(50), nullable=False)
    criteria_json: Mapped[Optional[dict[str, Any]]] = mapped_column(
        JSONB,
        nullable=True,
    )

    date: Mapped[date_type] = mapped_column(Date, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    user = relationship("User", back_populates="daily_songs")

    __table_args__ = (
        # Daily song must belong to either a logged-in user or an anonymous visitor.
        CheckConstraint(
            "user_id IS NOT NULL OR anonymous_id IS NOT NULL",
            name="ck_daily_songs_user_or_anonymous",
        ),
        # One song per day for a logged-in user.
        Index(
            "uq_daily_songs_user_date",
            "user_id",
            "date",
            unique=True,
            postgresql_where=text("user_id IS NOT NULL"),
        ),
        # One song per day for an anonymous visitor.
        Index(
            "uq_daily_songs_anonymous_date",
            "anonymous_id",
            "date",
            unique=True,
            postgresql_where=text("anonymous_id IS NOT NULL"),
        ),
    )