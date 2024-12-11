from sqlalchemy import Column, Integer, Float, DateTime, create_engine
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Mapped, mapped_column
from .core.config import settings
from datetime import datetime

Base = declarative_base()

class Measurement(Base):
    __tablename__ = 'measurements_iot'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime)
    value: Mapped[float] = mapped_column(Float)


class Limits(Base):
    __tablename__ = 'measument_limits'
    id = Column(Integer, primary_key=True, index=True)
    low = Column(Integer)
    high = Column(Integer)




engine = create_engine(settings.DATABASE_URL, echo=True, pool_size=20, max_overflow=0)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

Base.metadata.create_all(engine)
