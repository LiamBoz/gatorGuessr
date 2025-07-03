from fastapi import FastAPI
from database import db


app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}
    db.Session
