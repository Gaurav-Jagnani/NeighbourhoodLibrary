from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.books_api import books_api
from routers.users_api import users_api

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

app.include_router(books_api, prefix="/books")
app.include_router(users_api, prefix="/users")


@app.get("/")
def root() -> str:
    return "Hiiii"
