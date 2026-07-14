from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.database.session import engine
from app.routers import songs

# Main FastAPI application instance.
app = FastAPI(title="SongRoulette API")

# Allow the React frontend to communicate with the backend during development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    # Simple health check endpoint used to verify that the API is running.
    return {"status": "ok"}


@app.get("/health/db")
def database_health():
    # Simple database health check.
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))

    return {"database": "ok"}


# Register all song-related routes under the main application.
app.include_router(songs.router)