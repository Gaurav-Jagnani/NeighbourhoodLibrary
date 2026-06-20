from fastapi import APIRouter, Depends
from db import get_connection
from sqlalchemy import select
from schemas import Book
from models import BookModel

books_api = APIRouter()


@books_api.get("/")
def get_books(db_conn=Depends(get_connection)):
    s = select(BookModel)
    res = db_conn.execute(s)
    return [r._mapping for r in res.fetchall()]
