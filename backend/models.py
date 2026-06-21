from sqlalchemy.orm import declarative_base, Mapped, mapped_column
from sqlalchemy import String, Text, Integer, ForeignKey, Date
from datetime import date

Base = declarative_base()


class BookModel(Base):
    __tablename__ = "books"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    # thumbnail_image_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    # quantity: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    author: Mapped[str | None] = mapped_column(String(255), nullable=True)
    publisher: Mapped[str | None] = mapped_column(String(255), nullable=True)


class UserModel(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(20), nullable=True)
    address: Mapped[str | None] = mapped_column(Text, nullable=True)


class BorrowModel(Base):
    __tablename__ = "borrow"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)

    book_id: Mapped[int] = mapped_column(ForeignKey("books.id"), nullable=False)

    borrowed_at: Mapped[date] = mapped_column(Date, default=date.today, nullable=False)

    due_date: Mapped[date] = mapped_column(Date, nullable=False)

    returned_at: Mapped[date | None] = mapped_column(Date, nullable=True)

    status: Mapped[str] = mapped_column(String(20), default="BORROWED", nullable=False)
