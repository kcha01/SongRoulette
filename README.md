# SongRoulette

SongRoulette is a music discovery web application that gives users one Spotify song recommendation per day.

The app allows users to generate a daily song based on selected preferences such as mood, genre, discovery mode, era, and explicit content preference. Users can also choose a fully random surprise mode.

The current MVP works without user login and uses the Spotify Web API to fetch real tracks.

## Live Demo

Coming soon.

## Features

### Current MVP

- Generate one daily song without logging in
- Choose between guided recommendation mode and random mode
- Select mood, genre, discovery mode, era, and explicit content preference
- Fetch real tracks from Spotify Web API
- Save anonymous daily recommendations in PostgreSQL
- Return the same song for the same anonymous user during the same day
- Open the recommended song directly in Spotify
- Docker-based local development setup

### Planned Features

- Spotify login
- Daily limit increase for logged-in users
- Song history for logged-in users
- Basic listening statistics
- Add recommended songs to Spotify playlists
- Premium tier with advanced recommendation options
- Deployment-ready production setup

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router

### Backend

- Python
- FastAPI
- SQLAlchemy
- Alembic
- PostgreSQL

### Integrations

- Spotify Web API
- Spotify Client Credentials Flow

### DevOps

- Docker
- Docker Compose

## How It Works

```text
User selects recommendation options
        ↓
Frontend sends request to FastAPI backend
        ↓
Backend checks if this anonymous user already has a song for today
        ↓
If yes: return saved song from PostgreSQL
        ↓
If no: search Spotify, select a track, save it, and return it
        ↓
Frontend displays the daily song and Spotify link
```

## Project Structure

```text
songroulette/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── database/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   ├── alembic/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have installed:

- Docker
- Docker Compose
- Git
- Spotify Developer account

## Environment Variables

Create a `.env` file inside the `backend` directory:

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

The backend uses these credentials to authenticate with Spotify using the Client Credentials Flow.

The `.env` file should not be committed to GitHub.

## Run Locally

Clone the repository:

```bash
git clone https://github.com/TWOJ_LOGIN_GITHUB/NAZWA_REPO.git
cd NAZWA_REPO
```

Create a `.env` file inside the `backend` directory:

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

Start the application:

```bash
docker compose up --build
```

Run database migrations:

```bash
docker compose exec backend alembic upgrade head
```

Frontend:

```text
http://localhost:5173
```

Backend API:

```text
http://localhost:8000
```

Swagger documentation:

```text
http://localhost:8000/docs
```

## Database Migrations

Run Alembic migrations inside the backend container:

```bash
docker compose exec backend alembic upgrade head
```

Create a new migration after model changes:

```bash
docker compose exec backend alembic revision --autogenerate -m "migration message"
```

## Main API Endpoints

### Health Check

```http
GET /health
```

### Database Health Check

```http
GET /health/db
```

### Spotify Health Check

```http
GET /spotify/health
```

### Generate Daily Song

```http
POST /songs/daily
```

Example request:

```json
{
  "mode": "guided",
  "anonymousId": "browser-generated-id",
  "mood": "chill",
  "genre": "indie",
  "discovery": "balanced",
  "era": "any",
  "allowExplicit": false
}
```

Example response:

```json
{
  "id": "spotify_track_id",
  "title": "Song Title",
  "artist": "Artist Name",
  "album": "Album Name",
  "spotifyUrl": "https://open.spotify.com/track/...",
  "coverUrl": "https://i.scdn.co/image/...",
  "tags": ["chill", "indie", "balanced", "any", "Clean"],
  "isNew": true
}
```

## Current Product Rules

### Anonymous User

- Can generate one song per day
- Does not have access to history
- Does not have access to playlists
- Does not need to log in

### Future Logged-in User

- Will be able to generate more songs per day
- Will have access to song history
- Will be able to save songs to Spotify playlists

### Future Premium User

- Will unlock advanced recommendation options
- Will have extended or unlimited daily recommendations
- Will get advanced statistics and personalization features

## Screenshots

Coming soon.

## Status

MVP in progress.

The core recommendation flow is working:

```text
React → FastAPI → Spotify API → PostgreSQL → React
```

## Author

Created by Krzysztof Chamera as a portfolio project.

## License

This project is for portfolio and educational purposes.
