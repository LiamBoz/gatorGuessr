from pydantic import BaseModel

class Image(BaseModel):
    id: int
    title: str
    url: str
    created_at: str 

