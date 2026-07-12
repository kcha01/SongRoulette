-- Initial database schema for SongRoulette.
-- This file is used as documentation/reference.
-- Tables should be created through Alembic migrations, not by running this file manually.

CREATE TABLE users (
    id SERIAL PRIMARY KEY,

    spotify_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255),
    display_name VARCHAR(255),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE daily_songs (
    id SERIAL PRIMARY KEY,

    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    anonymous_id VARCHAR(255),

    spotify_track_id VARCHAR(255) NOT NULL,

    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    album VARCHAR(255),
    spotify_url TEXT NOT NULL,
    cover_url TEXT,

    mode VARCHAR(50) NOT NULL,
    criteria_json JSONB,

    date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT ck_daily_songs_user_or_anonymous
        CHECK (user_id IS NOT NULL OR anonymous_id IS NOT NULL)
);

CREATE UNIQUE INDEX uq_daily_songs_user_date
ON daily_songs (user_id, date)
WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX uq_daily_songs_anonymous_date
ON daily_songs (anonymous_id, date)
WHERE anonymous_id IS NOT NULL;