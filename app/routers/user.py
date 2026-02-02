from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from app.models import User, UserCreate, UserLogin
from app.database import engine
from app.auth import hash_password, verify_password, create_access_token

router = APIRouter()

@router.post("/register")
def create_user(user: UserCreate):
    with Session(engine) as session:
        
        existing = session.exec(select(User).where(User.username == user.username)).first()
        if existing:
            raise HTTPException(status_code=400, detail="Username already taken:")
        
        existing = session.exec(select(User).where(User.email == user.email)).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already taken")
        
        db_user = User(
            username=user.username,
            email=user.email,
            hashed_password=hash_password(user.password)
        )
        session.add(db_user)
        session.commit()
        return {"message": "User registered"}

@router.post("/login")
def user_login(user: UserLogin):
    with Session(engine) as session:
        existing = session.exec(select(User).where(User.username == user.username)).first()
        if not existing:
            raise HTTPException(status_code=401, detail="Invalid username or password")
        
        correct_password = verify_password(user.password, existing.hashed_password)

        if correct_password:
            token = create_access_token({"sub": user.username})
            return {"access_token": token, "token_type": "bearer"}
        else:
            raise HTTPException(status_code=401, detail="Invalid username or password")