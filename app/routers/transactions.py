from fastapi import APIRouter, HTTPException, Depends
from app.models import Transaction, TransactionCreate, TransactionUpdate, TransactionType
from sqlmodel import Session, select
from datetime import date
from app.database import engine
from app.auth import get_current_user
from app.models import User

router = APIRouter()


@router.post("/transactions")
def create_transaction(
    transaction: TransactionCreate, 
    current_user: User = Depends(get_current_user)
):
    with Session(engine) as session:
        db_transaction = Transaction(**transaction.model_dump(), user_id=current_user.id)
        session.add(db_transaction)
        session.commit()
        session.refresh(db_transaction)
        return db_transaction
    
@router.get("/transactions")
def get_transaction(
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 15,
    type: TransactionType | None = None,
    category: str | None = None,
    start_date: date | None = None,
    end_date: date | None = None,
):
    with Session(engine) as session:
        query = select(Transaction).where(Transaction.user_id == current_user.id)
        
        if type:
            query = query.where(Transaction.type == type)
        if category:
            query = query.where(Transaction.category == category)
        if start_date:
            query = query.where(Transaction.transaction_date >= start_date)
        if end_date:
            query = query.where(Transaction.transaction_date <= end_date)
        
        total = len(session.exec(query).all())
        transactions = session.exec(query.offset(skip).limit(limit)).all()

        return {"transactions": transactions, "total": total}

def get_transaction_or_404(session: Session, id: int):
    result = session.get(Transaction, id)
    if not result:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return result

@router.get("/transactions/summary")
def get_transaction_summary(current_user: User = Depends(get_current_user)):
    with Session(engine) as session:
        total_income = 0
        total_expense = 0
        results = session.exec(select(Transaction).where(Transaction.user_id == current_user.id)).all()
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

@router.get("/transactions/{id}")
def get_transaction_by_id(id: int, current_user: User = Depends(get_current_user)):
    with Session(engine) as session:
        result = get_transaction_or_404(session, id)
        if result.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized")
        return result

@router.delete("/transactions/{id}")
def delete_transaction(id: int, current_user: User = Depends(get_current_user)):
    with Session(engine) as session:
        transaction_to_delete = get_transaction_or_404(session, id)
        if transaction_to_delete.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized")
        session.delete(transaction_to_delete)
        session.commit()
        return {"message": "Transaction deleted"}
    

@router.put("/transactions/{id}")
def update_transaction(id: int, updates: TransactionUpdate, current_user: User = Depends(get_current_user)):
    with Session(engine) as session:
        transaction_to_update = get_transaction_or_404(session, id)
        if transaction_to_update.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized")

        update_data = updates.model_dump(exclude_unset=True)
        
        for key, value in update_data.items():
            setattr(transaction_to_update, key, value)
        
        session.commit()
        session.refresh(transaction_to_update)
        return transaction_to_update