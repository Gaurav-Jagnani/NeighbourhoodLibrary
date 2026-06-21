from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from routers.books_api import books_api
from routers.users_api import users_api
from routers.borrow_api import borrow_api
from routers.auth_router import auth_router, validate_token

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router, prefix="/auth")
app.include_router(books_api, prefix="/books", dependencies=[Depends(validate_token)])
app.include_router(users_api, prefix="/users", dependencies=[Depends(validate_token)])
app.include_router(borrow_api, prefix="/borrow", dependencies=[Depends(validate_token)])


@app.get("/")
def root() -> str:
    return "Hiiii"
