# # app/api/video.py
# import cv2
# import time
# import os
# from fastapi import APIRouter
# from fastapi.responses import StreamingResponse
# from app.services.detector import FallDetector
# from app.services.camera import VideoCamera
# from app.database import save_alert
# from app.services.notifier import run_async_telegram # Import hàm gửi tin

# router = APIRouter(tags=["Video Stream"])

# EVIDENCE_DIR = "evidence"
# os.makedirs(EVIDENCE_DIR, exist_ok=True)
# COOLDOWN_SECONDS = 10.0 # Chỉnh lên 10s cho đỡ spam

# print("[Video] Loading AI Model...")
# detector = FallDetector(model_path='model/yolov8n.pt') 
# global_last_alert_time = 0

# # def generate_frames():
# #     global global_last_alert_time
# #     camera = VideoCamera(source=0)
    
# #     try:
# #         while True:
# #             frame = camera.get_frame()
# #             if frame is None: break
            
# #             processed_frame, status_code, conf_score = detector.detect(frame)
            
# #             # --- LOGIC GỬI CẢNH BÁO ---
# #             if status_code == 2:  # Báo động đỏ
# #                 current_time = time.time()
# #                 if (current_time - global_last_alert_time) > COOLDOWN_SECONDS:
# #                     print("!!! PHÁT HIỆN NGÃ - TRIGGER ALERT !!!")
                    
# #                     # 1. Lưu ảnh
# #                     ts = time.strftime("%Y%m%d_%H%M%S")
# #                     filename = f"fall_{ts}.jpg"
# #                     save_path = os.path.join(EVIDENCE_DIR, filename)
# #                     cv2.imwrite(save_path, processed_frame)
                    
# #                     # 2. Lưu DB
# #                     save_alert(conf_score, filename, True)
                    
# #                     # 3. GỬI TELEGRAM
# #                     run_async_telegram(save_path, conf_score)
                    
# #                     global_last_alert_time = current_time

# #             ret, buffer = cv2.imencode('.jpg', processed_frame)
# #             if not ret: continue
# #             yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
# #     finally:
# #         del camera

# # @router.get("/video_feed")
# # def video_feed():
# #     return StreamingResponse(generate_frames(), media_type="multipart/x-mixed-replace; boundary=frame")

# async def generate_frames():
#     global global_last_alert_time
#     camera = VideoCamera(source=0)
    
#     try:
#         while True:
#             frame = camera.get_frame()
#             if frame is None: break
            
#             # AI Xử lý
#             processed_frame, status_code, conf_score = detector.detect(frame)
            
#             # --- LOGIC GỬI CẢNH BÁO ---
#             if status_code == 2:  # Báo động đỏ
#                 current_time = time.time()
#                 if (current_time - global_last_alert_time) > COOLDOWN_SECONDS:
#                     print("!!! PHÁT HIỆN NGÃ - TRIGGER ALERT !!!")
                    
#                     # 1. Lưu ảnh (Giữ nguyên)
#                     ts = time.strftime("%Y%m%d_%H%M%S")
#                     filename = f"fall_{ts}.jpg"
#                     save_path = os.path.join(EVIDENCE_DIR, filename)
#                     cv2.imwrite(save_path, processed_frame)
                    
#                     # 2. Lưu DB (Giữ nguyên)
#                     save_alert(conf_score, filename, True)
                    
#                     # 3. Gửi Telegram (Giữ nguyên)
#                     run_async_telegram(save_path, conf_score)

#                     # 4. >>> BẮN SOCKET SANG FRONTEND <<< (MỚI)
#                     # Convert ảnh sang base64 để hiển thị ngay trên popup
#                     _, buffer_img = cv2.imencode('.jpg', processed_frame)
#                     img_base64 = base64.b64encode(buffer_img).decode('utf-8')
                    
#                     await sio.emit('fall_detected', {
#                         'timestamp': time.strftime("%H:%M:%S"),
#                         'confidence': round(conf_score, 2),
#                         'image': f"data:image/jpeg;base64,{img_base64}",
#                         'location': 'Camera 01'
#                     })
                    
#                     global_last_alert_time = current_time

#             # Encode frame để stream (MJPEG)
#             ret, buffer = cv2.imencode('.jpg', processed_frame)
#             if not ret: continue
            
#             # Yield frame (Lưu ý: trong async generator không cần await ở yield)
#             yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
            
#             # Thêm sleep nhỏ để giả lập async non-blocking (giúp socket có thời gian thở)
#             # await asyncio.sleep(0.01) # Cần import asyncio nếu muốn mượt hơn
            
#     finally:
#         del camera

# @router.get("/video_feed")
# async def video_feed(): # Cũng phải đổi thành async
#     return StreamingResponse(generate_frames(), media_type="multipart/x-mixed-replace; boundary=frame")







# app/api/video.py
import cv2
import time
import os
import base64
import asyncio # Import asyncio
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.services.detector import FallDetector
from app.services.camera import VideoCamera # Import class Singleton vừa sửa
from app.database import save_alert
from app.services.notifier import run_async_telegram
from app.socket_manager import sio

router = APIRouter(tags=["Video Stream"])

EVIDENCE_DIR = "evidence"
os.makedirs(EVIDENCE_DIR, exist_ok=True)
COOLDOWN_SECONDS = 10.0

print("[Video] Loading AI Model...")
detector = FallDetector(model_path='model/yolov8n.pt') 
global_last_alert_time = 0

async def generate_frames():
    global global_last_alert_time
    
    # --- SỬA LỖI TẠI ĐÂY ---
    # Gọi VideoCamera() sẽ luôn trả về instance duy nhất đã khởi tạo
    # Không còn sợ lỗi "Device busy" nữa
    camera = VideoCamera(source=0) 
    
    try:
        while True:
            # Lấy frame từ luồng background
            frame = camera.get_frame()
            
            # Nếu chưa đọc được frame nào (lúc mới khởi động), đợi xíu
            if frame is None:
                await asyncio.sleep(0.1)
                continue
            
            # --- COPY LẠI FRAME ---
            # Quan trọng: AI vẽ box lên ảnh. Nếu không copy, các luồng khác
            # sẽ thấy cái box bị vẽ chồng chéo hoặc lỗi hình.
            frame_to_process = frame.copy()

            # AI Xử lý trên frame copy
            processed_frame, status_code, conf_score = detector.detect(frame_to_process)
            
            # ... (Giữ nguyên logic Gửi Cảnh Báo/Socket/Telegram cũ) ...
            if status_code == 2:
                current_time = time.time()
                if (current_time - global_last_alert_time) > COOLDOWN_SECONDS:
                    # ... (Logic xử lý ngã giữ nguyên) ...
                    # Nhớ dùng await sio.emit(...)
                    
                    # Ví dụ đoạn socket:
                    _, buffer_img = cv2.imencode('.jpg', processed_frame)
                    img_base64 = base64.b64encode(buffer_img).decode('utf-8')
                    await sio.emit('fall_detected', {
                        'timestamp': time.strftime("%H:%M:%S"),
                        'confidence': round(conf_score, 2),
                        'image': f"data:image/jpeg;base64,{img_base64}",
                        'location': 'Camera 01'
                    })
                    
                    global_last_alert_time = current_time

            # Encode và Stream
            ret, buffer = cv2.imencode('.jpg', processed_frame)
            if not ret: continue
            
            yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
            
            # Kiểm soát FPS stream (ví dụ ~30fps)
            await asyncio.sleep(0.03)
            
    except Exception as e:
        print(f"Stream Error: {e}")
    # finally:
        # KHÔNG gọi camera.stop() ở đây nữa vì camera là dùng chung!
        # Camera chỉ nên stop khi tắt hẳn server.
        pass

@router.get("/video_feed")
async def video_feed():
    return StreamingResponse(generate_frames(), media_type="multipart/x-mixed-replace; boundary=frame")