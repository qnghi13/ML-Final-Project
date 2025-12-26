# app/schemas.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
# Khuôn mẫu cho việc Đăng ký
class UserCreate(BaseModel):
    username: str
    password: str
    full_name: str | None = None
    phone_number: str | None = None

# Khuôn mẫu cho việc Đăng nhập
class UserLogin(BaseModel):
    username: str
    password: str

# Khuôn mẫu Token trả về
class Token(BaseModel):
    access_token: str
    token_type: str
    
class AlertResponse(BaseModel):
    id: int
    timestamp: datetime
    confidence: float
    image_path: str
    is_sent: bool

    class Config:
        orm_mode = True # Quan trọng: Để Pydantic đọc được dữ liệu từ SQLAlchemy Object