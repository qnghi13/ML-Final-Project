# app/database.py
import os
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean
from sqlalchemy.orm import sessionmaker, declarative_base
from datetime import datetime

# 1. Cấu hình DB
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "fall_data.db")
DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 2. Model User (Cập nhật)
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String, nullable=True)
    phone_number = Column(String, unique=True, index=True) # SĐT dùng để định danh
    telegram_chat_id = Column(String, nullable=True)       # Chứa ID Telegram (Mới)

# 3. Model Alert (Giữ nguyên)
class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.now)
    confidence = Column(Float)
    image_path = Column(String)
    is_sent = Column(Boolean, default=False)

# 4. Các hàm hỗ trợ
def init_db():
    Base.metadata.create_all(bind=engine)

def get_user_by_username(username: str):
    db = SessionLocal()
    try: return db.query(User).filter(User.username == username).first()
    finally: db.close()

def create_user(user_data: dict):
    db = SessionLocal()
    try:
        new_user = User(**user_data)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user
    except Exception as e:
        print(f"[DB Error] {e}")
        return None
    finally: db.close()

def save_alert(confidence: float, image_path: str, is_sent: bool = False):
    db = SessionLocal()
    try:
        new_alert = Alert(confidence=confidence, image_path=image_path, is_sent=is_sent)
        db.add(new_alert)
        db.commit()
        db.refresh(new_alert)
        return new_alert.id
    except: return None
    finally: db.close()

# --- HÀM MỚI QUAN TRỌNG ---
def update_telegram_mapping(phone: str, chat_id: str):
    """Liên kết SĐT với Chat ID"""
    db = SessionLocal()
    try:
        # Tìm user có SĐT này
        user = db.query(User).filter(User.phone_number == phone).first()
        if user:
            user.telegram_chat_id = chat_id
            db.commit()
            return True, user.username
        return False, None
    finally: db.close()

def get_linked_chat_ids():
    """Lấy danh sách tất cả Chat ID đã liên kết để gửi cảnh báo"""
    db = SessionLocal()
    try:
        users = db.query(User).filter(User.telegram_chat_id != None).all()
        return [u.telegram_chat_id for u in users]
    finally: db.close()