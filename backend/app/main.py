# Main application file, this is where the FastAPI application is created and configured. It also includes the routers for different endpoints.
from fastapi import FastAPI

from app.routers import songs

# Main FastAPI application instance.
app = FastAPI(title="SongRoulette API")


@app.get("/health")  
def health():
    #control endpoint to check if the API is running
    return {"status": "ok"}


# Register all song-related routes under the main application.
app.include_router(songs.router) 