from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

# SQLAlchemy engine responsible for connecting to the database.
engine = create_engine(settings.DATABASE_URL)

# Session factory used to create database sessions.
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def get_db():
    # Dependency used by FastAPI routes to access the database.
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()