from fastapi import APIRouter, Depends
from db import get_connection
from sqlalchemy import select
from schemas import User
from models import UserModel

users_api = APIRouter()


@users_api.get("/")
def get_books(db_conn=Depends(get_connection)):
    s = select(UserModel)
    res = db_conn.execute(s)
    return [r._mapping for r in res.fetchall()]
