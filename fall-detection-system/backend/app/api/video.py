import cv2
import time
import os
import base64
import asyncio
from fastapi import APIRouter, Query, Depends 
from fastapi.responses import StreamingResponse
from fastapi import APIRouter, HTTPException
import sqlite3
from app.core.database import DB_PATH
from datetime import datetime, timedelta
import pytz
# 1. Import Class Detector & Camera
from app.services.detector import FallDetector
from app.services.camera import VideoCamera

# 2. Import Database & Notifier
from app.core.database import get_alerts_by_user_id, save_alert, get_user_by_username
from app.api.auth import get_current_user
from app.services.notifier import send_telegram_alert
from app.core.socket_manager import sio

# 3. Import Socket
try:
    from app.core.socket_manager import sio
except ImportError:
    sio = None

router = APIRouter(tags=["Video Stream"])

EVIDENCE_DIR = "alert_images"
os.makedirs(EVIDENCE_DIR, exist_ok=True)
COOLDOWN_SECONDS = 10.0 

print("[API] Initializing Detector...")
detector = FallDetector(model_path='model/yolov8n.pt')
global_last_alert_time = 0

async def generate_frames(user_id, user_phone):
    global global_last_alert_time
    
    camera = VideoCamera(source=0)
    print(f"📷 Bắt đầu stream cho User ID: {user_id} - SĐT nhận tin: {user_phone}")

    try:
        while True:
            frame = camera.get_frame()
            if frame is None:
                await asyncio.sleep(1)
                continue
            
            processed_frame, status_code, conf_score = detector.detect(frame)
            
            if status_code == 2:
                current_time = time.time()
                if (current_time - global_last_alert_time) > COOLDOWN_SECONDS:
                    print(f"!!! PHÁT HIỆN NGÃ ({conf_score:.2f}) -> Gửi cho SĐT: {user_phone}")
                    
                    ts = time.strftime("%Y%m%d_%H%M%S")
                    filename = f"fall_{ts}.jpg"
                    save_path = os.path.join(EVIDENCE_DIR, filename)
                    cv2.imwrite(save_path, processed_frame)
                    
                    alert_id = save_alert(user_id=user_id, image_path=save_path, confidence=conf_score)
                    
                    if user_phone:
                        try:
                            send_telegram_alert(user_phone, save_path, alert_id)
                        except Exception as e:
                            print(f"Lỗi gửi Telegram: {e}")
                    else:
                        print("⚠️ User này chưa cập nhật số điện thoại, không thể gửi tin!")

                    if sio:
                        try:
                            _, buffer_img = cv2.imencode('.jpg', processed_frame)
                            img_base64 = base64.b64encode(buffer_img).decode('utf-8')
                            await sio.emit('fall_detected', {
                                'timestamp': time.strftime("%H:%M:%S"),
                                'confidence': round(conf_score, 2),
                                'image': f"data:image/jpeg;base64,{img_base64}"
                            })
                        except Exception:
                            pass
                    
                    global_last_alert_time = current_time

            ret, buffer = cv2.imencode('.jpg', processed_frame)
            if not ret: continue
            yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
            await asyncio.sleep(0.01)

    finally:
        del camera

@router.get("/video_feed")
async def video_feed(username: str = Query(..., description="Tên đăng nhập của người dùng")):
    """
    Ví dụ gọi: http://localhost:8000/api/video/video_feed?username=admin
    """
    user = get_user_by_username(username)
    
    if not user:
        return {"error": "User not found or not registered"}
    
    real_user_id = user['id']
    real_phone = user['phone_number']
    
    return StreamingResponse(
        generate_frames(user_id=real_user_id, user_phone=real_phone), 
        media_type="multipart/x-mixed-replace; boundary=frame"
    )



@router.get("/history")
async def get_history_api(current_user: dict = Depends(get_current_user)):
    """
    API này yêu cầu Token (đăng nhập).
    Nó sẽ tự động lấy ID từ Token và chỉ trả về dữ liệu của người đó.
    """
    try:
        user_id = current_user['id'] 
        results = get_alerts_by_user_id(user_id) 
        return results
    except Exception as e:
        print(f"❌ Lỗi API History: {e}")
        return []
    

@router.get("/stats/today")
async def get_today_stats():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    try:
        tz_VN = pytz.timezone('Asia/Ho_Chi_Minh')
        now_vn = datetime.now(tz_VN)
        
        start_of_day_vn = now_vn.replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_day_vn = start_of_day_vn + timedelta(days=1)

        start_utc = start_of_day_vn.astimezone(pytz.utc)
        end_utc = end_of_day_vn.astimezone(pytz.utc)

        start_str = start_utc.strftime("%Y-%m-%d %H:%M:%S")
        end_str = end_utc.strftime("%Y-%m-%d %H:%M:%S")

        query = """
            SELECT COUNT(*) FROM alerts 
            WHERE 
                replace(substr(timestamp, 1, 19), 'T', ' ') >= ? 
            AND 
                replace(substr(timestamp, 1, 19), 'T', ' ') < ?
        """
        c.execute(query, (start_str, end_str))
        
        count = c.fetchone()[0]

        display_date = now_vn.strftime("%Y-%m-%d")
        return {"date": display_date, "count": count}
        
    except Exception as e:
        print(f"❌ Lỗi: {e}")
        return {"date": "", "count": 0}
    finally:
        conn.close()