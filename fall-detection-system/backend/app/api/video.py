# app/api/video.py
import cv2
import time
import os
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.services.detector import FallDetector
from app.services.camera import VideoCamera
from app.database import save_alert
from app.services.notifier import run_async_telegram # Import hàm gửi tin

router = APIRouter(tags=["Video Stream"])

EVIDENCE_DIR = "evidence"
os.makedirs(EVIDENCE_DIR, exist_ok=True)
COOLDOWN_SECONDS = 10.0 # Chỉnh lên 10s cho đỡ spam

print("[Video] Loading AI Model...")
detector = FallDetector(model_path='model/yolov8n.pt') 
global_last_alert_time = 0

def generate_frames():
    global global_last_alert_time
    camera = VideoCamera(source=0)
    
    try:
        while True:
            frame = camera.get_frame()
            if frame is None: break
            
            processed_frame, status_code, conf_score = detector.detect(frame)
            
            # --- LOGIC GỬI CẢNH BÁO ---
            if status_code == 2:  # Báo động đỏ
                current_time = time.time()
                if (current_time - global_last_alert_time) > COOLDOWN_SECONDS:
                    print("!!! PHÁT HIỆN NGÃ - TRIGGER ALERT !!!")
                    
                    # 1. Lưu ảnh
                    ts = time.strftime("%Y%m%d_%H%M%S")
                    filename = f"fall_{ts}.jpg"
                    save_path = os.path.join(EVIDENCE_DIR, filename)
                    cv2.imwrite(save_path, processed_frame)
                    
                    # 2. Lưu DB
                    save_alert(conf_score, filename, True)
                    
                    # 3. GỬI TELEGRAM
                    run_async_telegram(save_path, conf_score)
                    
                    global_last_alert_time = current_time

            ret, buffer = cv2.imencode('.jpg', processed_frame)
            if not ret: continue
            yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
    finally:
        del camera

@router.get("/video_feed")
def video_feed():
    return StreamingResponse(generate_frames(), media_type="multipart/x-mixed-replace; boundary=frame")