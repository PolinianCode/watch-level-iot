from sqlalchemy import Column, Integer, Float, DateTime, create_engine
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .core.config import settings

Base = declarative_base()

class Measurement(Base):
    __tablename__ = 'measurements_iot'
    id = Column(Integer, primary_key=True, index=True)
    value = Column(Float)
    timestamp = Column(DateTime, default=func.now())  # Automatically set timestamp on creation

# PostgreSQL engine
engine = create_engine(settings.DATABASE_URL, echo=True, pool_size=20, max_overflow=0)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

# Create tables if they don't already exist
Base.metadata.create_all(engine)
