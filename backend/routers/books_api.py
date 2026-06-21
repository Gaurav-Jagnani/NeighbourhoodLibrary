from fastapi import APIRouter, Depends, HTTPException
from db import get_connection
from sqlalchemy import select, insert, update
from schemas import Book
from models import BookModel

books_api = APIRouter()


@books_api.get("/")
def get_books(db_conn=Depends(get_connection)):
    s = select(BookModel)
    res = db_conn.execute(s)
    return [r._mapping for r in res.fetchall()]


@books_api.post("/add")
def add_book(book: Book, db_conn=Depends(get_connection)):
    try:
        s = insert(BookModel).values({**book.model_dump(exclude={"id"})})
        db_conn.execute(s)
        db_conn.commit()
        return "Added successfully"
    except Exception as e:
        raise HTTPException(status_code=400, detail="Failed to add book: " + str(e))


@books_api.post("/update")
def update_book(book: Book, db_conn=Depends(get_connection)):
    try:
        s = (
            update(BookModel)
            .where(BookModel.id == book.id)
            .values({**book.model_dump(exclude={"id"})})
        )
        db_conn.execute(s)
        db_conn.commit()
        return "Updated successfully"
    except Exception as e:
        raise HTTPException(status_code=400, detail="Failed to add book " + str(e))
