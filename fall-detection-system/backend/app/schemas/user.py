from pydantic import BaseModel

# Khuôn mẫu cơ sở (Base)
class UserBase(BaseModel):
    username: str
    full_name: str | None = None
    phone_number: str | None = None

# Dùng cho lúc Đăng ký (Cần password)
class UserCreate(UserBase):
    password: str

# Dùng cho lúc Đăng nhập (Chỉ cần user/pass)
class UserLogin(BaseModel):
    username: str
    password: str

# Dùng để TRẢ VỀ dữ liệu cho Frontend (Ẩn password đi)
class UserResponse(UserBase):
    id: int

    class Config:
        # Pydantic V2 dùng 'from_attributes', V1 dùng 'orm_mode'
        from_attributes = True