from pydantic import BaseModel


class Book(BaseModel):
    # id: int
    name: str
    description: str | None
    author: str | None
    thumbnail_image_name: str | None
    # quantity: int
    author: str | None
    publisher: str | None


class User(BaseModel):
    id: int | None
    name: str
    email: str
    password: str
    address: str | None
    phone: str | None
