from datetime import date, timedelta

from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, Query
from db import get_connection
from sqlalchemy import select, insert, update, and_
from schemas import Book
from models import BorrowModel, UserModel, BookModel
from datetime import date

borrow_api = APIRouter()


class Borrow(BaseModel):
    book_id: int
    user_id: int
    due_date: date


@borrow_api.get("/")
def get_borrows(db_conn=Depends(get_connection)):
    s = (
        select(
            BorrowModel.id,
            BorrowModel.user_id,
            BorrowModel.book_id,
            BorrowModel.borrowed_at,
            BorrowModel.due_date,
            BorrowModel.returned_at,
            BorrowModel.status,
            UserModel.name.label("user_name"),
            BookModel.name.label("book_name"),
        )
        .join(UserModel, BorrowModel.user_id == UserModel.id)
        .join(BookModel, BorrowModel.book_id == BookModel.id)
    )
    res = db_conn.execute(s)
    return [r._mapping for r in res]


@borrow_api.post("/borrow")
def borrow_book(borrow: Borrow, db_conn=Depends(get_connection)):
    existing = db_conn.execute(
        select(BorrowModel).where(
            and_(
                BorrowModel.book_id == borrow.book_id, BorrowModel.status == "BORROWED"
            )
        )
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Book is already borrowed.")
    db_conn.execute(
        insert(BorrowModel).values(
            user_id=borrow.user_id,
            book_id=borrow.book_id,
            # due_date=date.today() + timedelta(days=7),
            due_date=borrow.due_date,
            status="BORROWED",
        )
    )
    db_conn.commit()
    return {"message": "Book borrowed"}


@borrow_api.post("/return")
def return_book(borrow_id: int = Query(...), db_conn=Depends(get_connection)):
    db_conn.execute(
        update(BorrowModel)
        .where(BorrowModel.id == borrow_id)
        .values(status="RETURNED", returned_at=date.today())
    )

    db_conn.commit()

    return {"message": "Book returned"}
