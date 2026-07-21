import os


class Settings:
    # Database connection string passed from docker-compose.yml.
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg://songroulette_user:songroulette_password@localhost:5432/songroulette_db",
    )

    # Spotify app credentials loaded from backend/.env.
    SPOTIFY_CLIENT_ID: str | None = os.getenv("SPOTIFY_CLIENT_ID")
    SPOTIFY_CLIENT_SECRET: str | None = os.getenv("SPOTIFY_CLIENT_SECRET")


settings = Settings()