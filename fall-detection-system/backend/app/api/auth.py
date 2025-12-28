from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
import random
import requests
import datetime
from pydantic import BaseModel
from dotenv import load_dotenv
import os
from telegram import Update
from telegram.ext import ApplicationBuilder, ContextTypes, CommandHandler, Application
from telegram.request import HTTPXRequest
from pydantic import BaseModel, Field
from app.core.database import DB_PATH
import sqlite3

# Import Schema
from app.schemas.token import Token 
from app.schemas.user import UserCreate, UserLogin, UserResponse

# Import Logic từ Core
from app.core.database import (
    create_user, 
    get_user_by_username, 
    get_subscribers_by_phone, # Lấy chat_id
    save_otp_for_user,        # Lưu OTP
    get_otp_of_user,          # Lấy OTP để check
    update_password           # Đổi pass
)
from app.core.security import create_access_token, verify_password, get_current_user, get_password_hash

# --- CẤU HÌNH BOT OTP (BOT THỨ 2) ---
# Hãy thay token của con bot mới vào đây
load_dotenv()
OTP_BOT_TOKEN = os.getenv("TELEGRAM_TOKEN")

router = APIRouter()

# --- SCHEMA DỮ LIỆU CHO QUÊN MẬT KHẨU ---
class ForgotRequest(BaseModel):
    username: str

class ResetRequest(BaseModel):
    username: str
    otp: str
    new_password: str

# --- HÀM GỬI TELEGRAM (DÙNG BOT RIÊNG) ---
def send_telegram_otp(chat_id, message):
    url = f"https://api.telegram.org/bot{OTP_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": chat_id, 
        "text": message, 
        "parse_mode": "Markdown"
    }
    try:
        requests.post(url, json=payload)
    except Exception as e:
        print(f"Lỗi gửi Telegram OTP: {e}")
    response = requests.post(url, json={"chat_id": chat_id, "text": message})
    print(f"DEBUG: Gửi tới {chat_id}, Trạng thái: {response.status_code}, Phản hồi: {response.text}")

# ==========================================
# 1. CÁC API CŨ (REGISTER, LOGIN, ME)
# ==========================================

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    """API Đăng ký tài khoản mới."""
    success = create_user(user_data)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username đã tồn tại"
        )
    return {"message": "Đăng ký thành công"}

@router.post("/login", response_model=Token)
async def login(form_data: UserLogin):
    """API Đăng nhập lấy Token."""
    user = get_user_by_username(form_data.username)
    if not user or not verify_password(form_data.password, user['password']):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sai tài khoản hoặc mật khẩu",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user['username']})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user = Depends(get_current_user)):
    """API lấy thông tin bản thân."""
    return current_user

# ==========================================
# 2. CÁC API MỚI (QUÊN MẬT KHẨU)
# ==========================================

@router.post("/forgot-password/request")
async def request_otp(data: ForgotRequest):
    """Bước 1: Nhận username -> Gửi OTP qua Telegram"""
    
    # 1. Kiểm tra user tồn tại
    user = get_user_by_username(data.username)
    if not user:
        # Trả về lỗi chung chung hoặc 404 tùy chính sách bảo mật
        raise HTTPException(status_code=404, detail="Không tìm thấy tài khoản.")

    phone = user['phone_number']
    if not phone:
        raise HTTPException(status_code=400, detail="Tài khoản này chưa cập nhật số điện thoại.")

    # 2. Tìm ChatID Telegram liên kết với số điện thoại này
    chat_ids = get_subscribers_by_phone(phone)
    if not chat_ids:
        raise HTTPException(status_code=400, detail="Chưa liên kết Telegram. Vui lòng chat /start với Bot.")

    # 3. Sinh mã OTP 6 số
    otp_code = f"{random.randint(100000, 999999)}"
    
    # 4. Lưu vào DB (Hết hạn sau 5 phút)
    expiry_time = datetime.datetime.now() + datetime.timedelta(minutes=5)
    save_otp_for_user(data.username, otp_code, expiry_time)

    # 5. Gửi tin nhắn qua Bot OTP
    msg = (
        f"🔐 *YÊU CẦU ĐẶT LẠI MẬT KHẨU*\n\n"
        f"Mã xác thực (OTP) của bạn là: `{otp_code}`\n\n"
        f"⚠️ Mã này có hiệu lực trong 5 phút.\n"
        f"Tuyệt đối KHÔNG chia sẻ mã này cho người khác."
    )
    
    for chat_id in chat_ids:
        send_telegram_otp(chat_id, msg)

    return {"message": "Đã gửi mã OTP qua Telegram."}

@router.post("/forgot-password/reset")
async def reset_password(data: ResetRequest):
    """Bước 2: Nhận OTP + Pass mới -> Đổi mật khẩu"""
    
    # 1. Lấy OTP từ DB ra check
    record = get_otp_of_user(data.username)
    if not record or not record[0]:
        raise HTTPException(status_code=400, detail="Chưa có yêu cầu OTP nào cho tài khoản này.")
    
    saved_otp = record[0]
    expiry_str = record[1]

    # 2. So khớp mã OTP
    if saved_otp != data.otp:
        raise HTTPException(status_code=400, detail="Mã OTP không chính xác.")

    # 3. Kiểm tra thời gian hết hạn
    try:
        expiry_time = datetime.datetime.strptime(expiry_str, "%Y-%m-%d %H:%M:%S.%f")
    except ValueError:
        expiry_time = datetime.datetime.strptime(expiry_str, "%Y-%m-%d %H:%M:%S")

    if datetime.datetime.now() > expiry_time:
        raise HTTPException(status_code=400, detail="Mã OTP đã hết hạn. Vui lòng yêu cầu lại.")

    # 4. Hash mật khẩu mới và lưu vào DB
    new_hashed_pass = get_password_hash(data.new_password)
    update_password(data.username, new_hashed_pass)

    return {"message": "Đổi mật khẩu thành công. Hãy đăng nhập lại."}


class UpdateProfileRequest(BaseModel):
    username: str
    full_name: str
    phone_number: str = Field(..., pattern=r"^[0-9]{10}$")

@router.post("/update-profile")
async def update_profile(data: UpdateProfileRequest):
    print(f"📥 DEBUG: Nhận yêu cầu update cho user: {data.username}") 

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    try:
        c.execute("UPDATE users SET full_name = ?, phone = ? WHERE username = ?",
                  (data.full_name, data.phone_number, data.username))
        
        conn.commit()
        
        if c.rowcount == 0:
             raise HTTPException(status_code=404, detail="Không tìm thấy user để cập nhật")

        return {
            "message": "Update thành công", 
            "full_name": data.full_name, 
            "phone_number": data.phone_number
        }

    except sqlite3.Error as e:
        print(f"❌ SQL ERROR: {e}")
        raise HTTPException(status_code=500, detail=f"Lỗi Database: {str(e)}")
        
    except Exception as e:
        print(f"❌ SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))
        
    finally:
        conn.close()


class ChangePasswordRequest(BaseModel):
    username: str
    current_password: str
    new_password: str

@router.post("/change-password")
async def change_password(data: ChangePasswordRequest):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    try:
        # 1. Lấy mật khẩu cũ trong DB
        c.execute("SELECT password FROM users WHERE username = ?", (data.username,))
        row = c.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="User không tồn tại")
            
        stored_password_hash = row[0]

        # 2. Kiểm tra mật khẩu cũ có đúng không
        if not verify_password(data.current_password, stored_password_hash):
            raise HTTPException(status_code=400, detail="Mật khẩu hiện tại không đúng")

        # 3. Hash mật khẩu mới và lưu vào DB
        new_hash = get_password_hash(data.new_password)
        c.execute("UPDATE users SET password = ? WHERE username = ?", (new_hash, data.username))
        conn.commit()
        
        return {"message": "Đổi mật khẩu thành công"}
        
    finally:
        conn.close()