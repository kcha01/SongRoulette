from fastapi import FastAPI

from app.routers import songs

app = FastAPI(title="SongRoulette API")


@app.get("/health")
def health():
    return {"status": "ok"}


app.include_router(songs.router)