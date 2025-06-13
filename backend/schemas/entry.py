from pydantic import BaseModel

class Entry(BaseModel):
    id: str
    image_id: int
    latitude: float
    longitude: float
    likes: int
    dislikes: int
    created_at: str
