from database.base import Base
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

class ImageTable(Base):
    __tablename__ = "images"

    id: int = mapped_column(primary_key=True)
    title: str = column()

class EntryTable(Base):
    __tablename__ = "entries"

class GuessTable(Base):
    __tablename__ = "guesses"
