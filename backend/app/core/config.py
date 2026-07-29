import os


class Settings:
    # Application environment: "development" or "production".
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg://songroulette_user:songroulette_password@localhost:5432/songroulette_db",
    )

    SPOTIFY_CLIENT_ID: str | None = os.getenv("SPOTIFY_CLIENT_ID")
    SPOTIFY_CLIENT_SECRET: str | None = os.getenv("SPOTIFY_CLIENT_SECRET")

    # Comma-separated list of frontend URLs allowed to call the backend.
    BACKEND_CORS_ORIGINS: str = os.getenv(
        "BACKEND_CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    )

    # Basic MVP rate limits for the daily song endpoint.
    SONGS_DAILY_RATE_LIMIT_PER_MINUTE: int = int(
        os.getenv("SONGS_DAILY_RATE_LIMIT_PER_MINUTE", "3")
    )
    SONGS_DAILY_RATE_LIMIT_PER_HOUR: int = int(
        os.getenv("SONGS_DAILY_RATE_LIMIT_PER_HOUR", "20")
    )

    @property
    def cors_origins(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.BACKEND_CORS_ORIGINS.split(",")
            if origin.strip()
        ]

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"


settings = Settings()