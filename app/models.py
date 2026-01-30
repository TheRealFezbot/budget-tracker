from sqlmodel import Field, SQLModel
from datetime import date

class Transaction(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    description: str | None
    type: str
    amount: float
    transaction_date: date

class TransactionCreate(SQLModel):
    name: str
    description: str | None
    type: str
    amount: float
    transaction_date: date