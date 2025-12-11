import cv2
import uvicorn
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

# Import các module chúng ta đã viết
# Lưu ý: Đảm bảo cấu trúc thư mục đúng để import hoạt động
from app.services.detector import FallDetector
from app.services.camera import VideoCamera

# Khởi tạo FastAPI App
app = FastAPI(title="Fall Detection AI System")

# Cấu hình CORS (Để Frontend React chạy ở port khác có thể gọi API này)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cho phép mọi nguồn (trong môi trường Dev)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === KHỞI TẠO GLOBAL INSTANCE ===
# Load model ngay khi server bật để không phải load lại mỗi lần request
# Đổi 'model/best.pt' thành đường dẫn thực tế file model của bạn
print("Đang khởi tạo hệ thống AI...")
detector = FallDetector(model_path='model/yolov8n.pt') 
print("Hệ thống đã sẵn sàng!")

def generate_frames():
    """
    Hàm generator xử lý luồng video:
    1. Lấy frame từ Camera
    2. Đưa qua Detector để vẽ box & check ngã
    3. Encode thành JPEG để gửi qua mạng
    """
    camera = VideoCamera(source=0) # Mở Webcam số 0
    
    try:
        while True:
            frame = camera.get_frame()
            if frame is None:
                break
            
            # --- BƯỚC QUAN TRỌNG: XỬ LÝ AI ---
            # Hàm detect trả về frame đã vẽ và trạng thái cảnh báo
            processed_frame, is_alert = detector.detect(frame)
            
            # (Giai đoạn sau: Nếu is_alert == True -> Gửi Telegram ở đây)
            if is_alert:
                # Todo: await notifier.send_alert(...)
                pass

            # Encode frame thành JPEG để stream
            ret, buffer = cv2.imencode('.jpg', processed_frame)
            if not ret:
                continue
            
            frame_bytes = buffer.tobytes()
            
            # Trả về dữ liệu theo chuẩn MJPEG (Multipart JPEG)
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
    finally:
        del camera # Đảm bảo tắt camera khi client ngắt kết nối

@app.get("/")
def root():
    return {"status": "System is running", "model": "YOLOv8 Custom"}

@app.get("/video_feed")
def video_feed():
    """
    Endpoint stream video.
    Dùng thẻ <img src="http://localhost:8000/video_feed" /> để xem.
    """
    return StreamingResponse(generate_frames(), 
                             media_type="multipart/x-mixed-replace; boundary=frame")

# Đoạn này để chạy trực tiếp file main.py bằng python (cho dễ debug)
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)