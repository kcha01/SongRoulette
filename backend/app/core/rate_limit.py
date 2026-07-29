from collections import defaultdict, deque
from time import time

from fastapi import HTTPException, Request

from app.core.config import settings


minute_requests: dict[str, deque[float]] = defaultdict(deque)
hour_requests: dict[str, deque[float]] = defaultdict(deque)


def enforce_daily_song_rate_limit(request: Request) -> None:
    # Basic in-memory rate limit for the daily song endpoint.
    # Good enough for MVP. For multi-instance production, use Redis instead.
    client_ip = get_client_ip(request)
    now = time()

    check_rate_window(
        bucket=minute_requests,
        key=client_ip,
        now=now,
        window_seconds=60,
        max_requests=settings.SONGS_DAILY_RATE_LIMIT_PER_MINUTE,
    )

    check_rate_window(
        bucket=hour_requests,
        key=client_ip,
        now=now,
        window_seconds=60 * 60,
        max_requests=settings.SONGS_DAILY_RATE_LIMIT_PER_HOUR,
    )


def get_client_ip(request: Request) -> str:
    # Behind hosting providers, the real client IP is often passed in X-Forwarded-For.
    forwarded_for = request.headers.get("x-forwarded-for")

    if forwarded_for:
        return forwarded_for.split(",")[0].strip()

    if request.client:
        return request.client.host

    return "unknown"


def check_rate_window(
    bucket: dict[str, deque[float]],
    key: str,
    now: float,
    window_seconds: int,
    max_requests: int,
) -> None:
    timestamps = bucket[key]

    while timestamps and now - timestamps[0] > window_seconds:
        timestamps.popleft()

    if len(timestamps) >= max_requests:
        retry_after_seconds = int(window_seconds - (now - timestamps[0]))

        raise HTTPException(
            status_code=429,
            detail={
                "code": "RATE_LIMIT_EXCEEDED",
                "message": "Too many requests. Please wait a moment and try again.",
                "retryAfterSeconds": retry_after_seconds,
            },
        )

    timestamps.append(now)