from fastapi import FastAPI, HTTPException
from contextlib import asynccontextmanager
from sqlmodel import Session, select
from app.database import create_db_and_tables, engine
from app.models import Transaction, TransactionCreate, TransactionUpdate, TransactionType

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

def get_transaction_or_404(session: Session, id: int):
    result = session.get(Transaction, id)
    if not result:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return result

@app.get("/transactions/summary")
def get_transaction_summary():
    with Session(engine) as session:
        total_income = 0
        total_expense = 0
        results = session.exec(select(Transaction)).all()
        for result in results:
            if result.type == TransactionType.income:
                total_income += result.amount
            if result.type == TransactionType.expense:
                total_expense += result.amount
        
        net_balance = total_income - total_expense

        return {
            "total_income": total_income, 
            "total_expense": total_expense, 
            "net_balance": net_balance
        }

@app.get("/transactions/{id}")
def get_transaction_by_id(id: int):
    with Session(engine) as session:
        result = get_transaction_or_404(session, id)
        return result

@app.delete("/transactions/{id}")
def delete_transaction(id: int):
    with Session(engine) as session:
        transaction_to_delete = get_transaction_or_404(session, id)
        session.delete(transaction_to_delete)
        session.commit()
        return {"message": "Transaction deleted"}
    

@app.put("/transactions/{id}")
def update_transaction(id: int, updates: TransactionUpdate):
    with Session(engine) as session:
        transaction_to_update = get_transaction_or_404(session, id)
        update_data = updates.model_dump(exclude_unset=True)
        
        for key, value in update_data.items():
            setattr(transaction_to_update, key, value)
        
        session.commit()
        session.refresh(transaction_to_update)
        return transaction_to_update
