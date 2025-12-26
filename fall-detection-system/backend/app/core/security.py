from datetime import datetime, timedelta
from typing import Optional
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

# --- CẤU HÌNH BẢO MẬT ---
# Trong thực tế nên để SECRET_KEY trong file .env
SECRET_KEY = "chuoi_bi_mat_sieu_kho_doan_cua_nhom_ban"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Đối tượng xử lý mã hóa mật khẩu
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Định nghĩa nơi lấy Token (API sẽ tìm header Authorization: Bearer <token>)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- 1. CÁC HÀM MÃ HÓA PASSWORD (Dùng cho Register/Login) ---

def verify_password(plain_password, hashed_password):
    """So khớp mật khẩu nhập vào với mật khẩu đã mã hóa"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    """Mã hóa mật khẩu trước khi lưu DB"""
    return pwd_context.hash(password)

# --- 2. CÁC HÀM XỬ LÝ TOKEN (JWT) ---

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Tạo JWT Token khi đăng nhập thành công"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Hàm Dependency quan trọng nhất:
    - Giải mã Token.
    - Lấy user từ DB.
    - Bảo vệ các API (chỉ ai có token đúng mới qua được).
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Giải mã token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    # --- QUAN TRỌNG: Import Local để tránh Circular Import ---
    # Vì database.py đã import security.py, nên ta không được import ngược lại ở đầu file.
    from app.core.database import get_user_by_username 
    
    user = get_user_by_username(username)
    if user is None:
        raise credentials_exception
        
    return user