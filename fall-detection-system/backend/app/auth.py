# app/auth.py
from passlib.context import CryptContext

# Khởi tạo context mã hóa dùng thuật toán bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    """Kiểm tra mật khẩu nhập vào có khớp với mật khẩu đã mã hóa không"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    """Mã hóa mật khẩu thô thành chuỗi hash"""
    return pwd_context.hash(password)