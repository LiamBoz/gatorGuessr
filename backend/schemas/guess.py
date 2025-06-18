from pydantic import BaseModel

class Guess(BaseModel):
    id: str
    entry_id: int
    guessed_longitude: float
    guessed_latitude: float
    distance: float
    score: int
    created_at: str
