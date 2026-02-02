from sqlmodel import Field, SQLModel
from datetime import date
from enum import Enum

class TransactionType(str, Enum):
    income = "income"
    expense = "expense"

class Transaction(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    name: str
    description: str | None
    type: TransactionType
    amount: float
    transaction_date: date

class TransactionCreate(SQLModel):
    name: str
    description: str | None
    type: TransactionType
    amount: float
    transaction_date: date

class TransactionUpdate(SQLModel):
    name: str | None = None
    description: str | None = None
    type: TransactionType | None = None
    amount: float | None = None
    transaction_date: date | None = None

class User(SQLModel, table=True):
    __tablename__ = "users"
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(unique=True)
    email: str = Field(unique=True)
    hashed_password: str

class UserCreate(SQLModel):
    username: str = Field(unique=True)
    email: str = Field(unique=True)
    password: str

class UserLogin(SQLModel):
    username: str
    password: str