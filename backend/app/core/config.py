import os


class Settings:
    # Database connection string passed from docker-compose.yml.
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg://songroulette_user:songroulette_password@localhost:5432/songroulette_db",
    )


settings = Settings()