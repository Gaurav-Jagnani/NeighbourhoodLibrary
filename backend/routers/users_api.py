from fastapi import APIRouter, Depends, HTTPException
from db import get_connection
from sqlalchemy import select, insert, update
from schemas import User
from models import UserModel

users_api = APIRouter()


@users_api.get("/")
def get_books(db_conn=Depends(get_connection)):
    s = select(UserModel)
    res = db_conn.execute(s)
    return [r._mapping for r in res.fetchall()]


@users_api.post("/add")
def add_user(user: User, db_conn=Depends(get_connection)):
    try:
        s = insert(UserModel).values({**user.model_dump(exclude={"id"})})
        db_conn.execute(s)
        db_conn.commit()
        return "Added successfully"
    except Exception as e:
        raise HTTPException(status_code=400, detail="Failed to add user: " + str(e))


@users_api.post("/update")
def update_user(user: User, db_conn=Depends(get_connection)):
    try:
        s = (
            update(UserModel)
            .where(UserModel.id == user.id)
            .values({**user.model_dump(exclude={"id"})})
        )
        db_conn.execute(s)
        db_conn.commit()
        return "Updated successfully"
    except Exception as e:
        raise HTTPException(status_code=400, detail="Failed to add user: " + str(e))
