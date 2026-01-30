from fastapi import FastAPI
from contextlib import asynccontextmanager
from sqlmodel import Session, select
from app.database import create_db_and_tables, engine
from app.models import Transaction, TransactionCreate

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)

@app.get("/")
async def root():
    return {"message": "Budget Tracker API"}

@app.post("/transactions")
def create_transaction(transaction: TransactionCreate):
    with Session(engine) as session:
        db_transaction = Transaction(**transaction.model_dump())
        session.add(db_transaction)
        session.commit()
        session.refresh(db_transaction)
        return db_transaction
    
@app.get("/transactions")
def get_transaction():
    with Session(engine) as session:
        result = session.exec(select(Transaction)).all()
        return result
