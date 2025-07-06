from database.base import Base
from sqlalchemy import Float, String, Column, Integer

class ImageTable(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True)
    title = Column(String)
    url = Column(String)
    created_at = Column(String)

class EntryTable(Base):
    __tablename__ = "entries"
    id = Column(Integer, primary_key=True)
    image_id = Column(Integer)
    latitude = Column(Float)
    longitude = Column(Float)
    likes = Column(Integer)
    dislikes = Column(Integer)
    created_at = Column(String)

class GuessTable(Base):
    __tablename__ = "guesses"
    id = Column(Integer, primary_key=True)
    entry_id = Column(Integer)
    guessed_longitude = Column(Float)
    guessed_latitude = Column(Float)
    distance = Column(Float)
    score = Column(Integer)
    created_at = Column(String)

