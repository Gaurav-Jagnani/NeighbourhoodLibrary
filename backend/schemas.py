from pydantic import BaseModel


class Book(BaseModel):
    id: int
    name: str
    description: str
    author: str


class User(BaseModel):
    id: int
    name: str
    email: str
    address: str
