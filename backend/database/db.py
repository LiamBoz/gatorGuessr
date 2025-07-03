from sqlalchemy import create_engine
from sqlalchemy.orm import Session

engine = create_engine("postgresql+psycopg2://admin:password@localhost:5432/postgres", echo=True)


