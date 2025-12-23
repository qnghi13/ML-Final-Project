# app/api/auth.py
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from app.database import get_user_by_username, create_user
from app.auth import get_password_hash, verify_password
from app.schemas import UserCreate, Token

# Dùng router thay vì app
router = APIRouter(tags=["Authentication"])

@router.post("/register", status_code=201)
def register(user: UserCreate):
    # Check trùng user
    if get_user_by_username(user.username):
        raise HTTPException(status_code=400, detail="Tên đăng nhập đã tồn tại")
    
    # Tạo user mới
    user_data = {
        "username": user.username,
        "hashed_password": get_password_hash(user.password),
        "full_name": user.full_name,
        "phone_number": user.phone_number
    }
    create_user(user_data)
    return {"message": "Đăng ký thành công"}

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = get_user_by_username(form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Sai thông tin đăng nhập")
    
    # Token demo (sau này thay bằng JWT thật)
    fake_token = f"token-cua-{user.username}"
    return {"access_token": fake_token, "token_type": "bearer"}