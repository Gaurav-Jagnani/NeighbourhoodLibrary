from fastapi import APIRouter, Body, Header, HTTPException
import jwt
from fastapi.responses import JSONResponse
import config
from pydantic import BaseModel

auth_router = APIRouter()


class LoginRequest(BaseModel):
    username: str
    password: str


@auth_router.post("/login")
def login(loginRequest: LoginRequest):
    if loginRequest.username != "test" or loginRequest.password != "test":
        raise HTTPException(status_code=401, detail="Incorrect username/password")
    return jwt.encode({"user": loginRequest.username}, config.SECRET, algorithm="HS256")


def validate_token(authorization: str = Header(...)):
    try:
        token = authorization.split("Bearer ")[1]
        return jwt.decode(token, config.SECRET, algorithms=["HS256"])
    except:
        raise HTTPException(status_code=401, detail="Invalid/missing token")
