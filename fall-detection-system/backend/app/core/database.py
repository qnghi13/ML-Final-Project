import sqlite3
import os
from app.core.security import get_password_hash, verify_password

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "../../app_data.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    # 1. Bảng Users (Tài khoản Web)
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                  username TEXT UNIQUE, 
                  password TEXT, 
                  full_name TEXT,
                  phone TEXT,
                  reset_otp TEXT,
                  otp_expiry DATETIME)''')
    
    # 2. Bảng Subscribers (Telegram nhận tin)
    c.execute('''CREATE TABLE IF NOT EXISTS telegram_subscribers
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  user_phone TEXT,       
                  chat_id TEXT,          
                  telegram_name TEXT,    
                  UNIQUE(user_phone, chat_id))''')
                  
    # 3. Bảng Alerts (Lịch sử cảnh báo ngã)
    c.execute('''CREATE TABLE IF NOT EXISTS alerts
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  user_id INTEGER,
                  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                  image_path TEXT,
                  is_sent BOOLEAN DEFAULT 0,
                  confidence REAL,
                  FOREIGN KEY(user_id) REFERENCES users(id))''')
    
    conn.commit()
    conn.close()

# --- CÁC HÀM CHO WEB API & AUTH ---

def get_user_by_username(username: str):
    """Tìm user web theo username (Dùng cho Login)"""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id, username, password, full_name, phone FROM users WHERE username = ?", (username,))
    row = c.fetchone()
    conn.close()
    
    if row:
        return {
            "id": row[0],
            "username": row[1],
            "password": row[2], 
            "full_name": row[3],
            "phone_number": row[4]
        }
    return None

def create_user(user_data):
    """Tạo user web mới (Hỗ trợ cả Pydantic Object và Dictionary)"""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    if hasattr(user_data, 'model_dump'):
        data = user_data.model_dump() 
    elif hasattr(user_data, 'dict'):
        data = user_data.dict()       
    else:
        data = user_data              

    hashed_password = get_password_hash(data['password'])
    
    try:
        c.execute("INSERT INTO users (username, password, full_name, phone) VALUES (?, ?, ?, ?)",
                  (data['username'], 
                   hashed_password, 
                   data.get('full_name'),
                   data.get('phone_number')
                  ))
        conn.commit()
        return True
    except sqlite3.IntegrityError:
        return False
    finally:
        conn.close()

# --- CÁC HÀM CHO AI & VIDEO STREAM ---

def save_alert(user_id, image_path, confidence=1.0):
    """Lưu lại sự kiện ngã vào DB"""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    try:
        c.execute("INSERT INTO alerts (user_id, image_path, confidence, is_sent) VALUES (?, ?, ?, 0)",
                  (user_id, image_path, confidence))
        conn.commit()
        alert_id = c.lastrowid
    except Exception as e:
        print(f"Lỗi lưu alert: {e}")
        alert_id = None
    finally:
        conn.close()
    return alert_id

def update_alert_sent_status(alert_id, is_sent=True):
    """Cập nhật trạng thái đã gửi tin nhắn hay chưa"""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("UPDATE alerts SET is_sent = ? WHERE id = ?", (1 if is_sent else 0, alert_id))
    conn.commit()
    conn.close()

# --- CÁC HÀM CHO BOT TELEGRAM ---

def login_telegram_subscriber(username, password, chat_id, telegram_name):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    c.execute("SELECT password, phone FROM users WHERE username = ?", (username,))
    row = c.fetchone()
    
    if not row:
        conn.close()
        return False, "❌ Tài khoản không tồn tại!"
    
    stored_hash = row[0]
    user_phone = row[1]
    
    if not verify_password(password, stored_hash):
        conn.close()
        return False, "❌ Sai mật khẩu!"
    
    if not user_phone:
        conn.close()
        return False, "⚠️ Tài khoản Web này chưa cập nhật số điện thoại!"

    try:
        c.execute("INSERT OR IGNORE INTO telegram_subscribers (user_phone, chat_id, telegram_name) VALUES (?, ?, ?)", 
                  (user_phone, chat_id, telegram_name))
        conn.commit()
        msg = f"✅ Đăng nhập thành công!\nTài khoản '{username}' đã được liên kết."
        success = True
    except Exception:
        msg = "⚠️ Lỗi hệ thống."
        success = False
        
    conn.close()
    return success, msg

def get_subscribers_by_phone(phone):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT chat_id FROM telegram_subscribers WHERE user_phone = ?", (phone,))
    rows = c.fetchall()
    conn.close()
    return [row[0] for row in rows]

# --- HÀM MỚI THÊM ĐỂ HIỂN THỊ LỊCH SỬ LÊN WEB ---
def get_alerts_by_user_id(user_id):
    conn = get_db_connection() # Hoặc sqlite3.connect(...) tùy code cũ của bạn
    c = conn.cursor()
    
    c.execute("SELECT id, timestamp, confidence, image_path FROM alerts WHERE user_id = ? ORDER BY id DESC LIMIT 50", (user_id,))
    rows = c.fetchall()
    conn.close()
    
    results = []
    for row in rows:
        db_image_path = row[3] 
        

        if not os.path.exists(db_image_path):
            continue 
            

        img_filename = os.path.basename(db_image_path)
        img_url = f"http://localhost:8000/evidence/{img_filename}"
        
        results.append({
            "id": row[0],
            "timestamp": row[1],
            "confidence": row[2],
            "image_url": img_url
        })
    return results

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def save_otp_for_user(username, otp, expiry_time):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("UPDATE users SET reset_otp = ?, otp_expiry = ? WHERE username = ?", 
              (otp, expiry_time, username))
    conn.commit()
    conn.close()

# --- THÊM HÀM LẤY OTP ĐỂ CHECK ---
def get_otp_of_user(username):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT reset_otp, otp_expiry FROM users WHERE username = ?", (username,))
    row = c.fetchone()
    conn.close()
    return row 

# --- THÊM HÀM ĐỔI MẬT KHẨU MỚI ---
def update_password(username, new_hashed_password):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("UPDATE users SET password = ?, reset_otp = NULL, otp_expiry = NULL WHERE username = ?", 
              (new_hashed_password, username))
    conn.commit()
    conn.close()