import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Fallback to sqlite if connection to PostgreSQL fails locally for easy dev testing
DEFAULT_DB_URL = "sqlite:///./insightforge.db"
# DEFAULT_DB_URL = "postgresql://insightforge_admin:change_this_to_a_secure_password@localhost:5432/insightforge_db"
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_DB_URL)

engine = create_engine(
    DATABASE_URL, 
    # check_same_thread=False is needed for SQLite, ignored for postgres
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
