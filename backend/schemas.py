from pydantic import BaseModel


class Book(BaseModel):
    id: int | None = None
    name: str
    description: str | None
    # thumbnail_image_name: str | None
    # quantity: int
    author: str | None
    publisher: str | None


class User(BaseModel):
    id: int | None = None
    name: str
    email: str
    password: str
    address: str | None
    phone: str | None
