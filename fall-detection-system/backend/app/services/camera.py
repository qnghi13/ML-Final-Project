# import cv2

# class VideoCamera:
#     def __init__(self, source=0):
#         """
#         Khởi tạo Camera.
#         source: 0 (Webcam laptop), 1 (Webcam rời), hoặc đường dẫn RTSP (IP Camera)
#         """
#         self.cap = cv2.VideoCapture(source)
#         if not self.cap.isOpened():
#             raise ValueError("Không thể mở Camera. Hãy kiểm tra lại kết nối!")

#     def __del__(self):
#         # Giải phóng camera khi class bị hủy
#         if self.cap.isOpened():
#             self.cap.release()

#     def get_frame(self):
#         """
#         Đọc 1 frame từ camera.
#         Return: Frame ảnh (numpy array) hoặc None nếu lỗi.
#         """
#         if self.cap.isOpened():
#             ret, frame = self.cap.read()
#             if ret:
#                 # Resize ảnh nếu cần (để tăng tốc độ xử lý cho model)
#                 # frame = cv2.resize(frame, (640, 640)) 
#                 return frame
#         return None


# app/services/camera.py
import cv2
import threading
import time

class VideoCamera:
    _instance = None       # Biến lưu instance duy nhất (Singleton)
    _lock = threading.Lock() # Lock để đảm bảo thread-safe khi khởi tạo

    def __new__(cls, source=0):
        # Logic Singleton: Nếu đã có instance rồi thì trả về nó, không tạo mới
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super(VideoCamera, cls).__new__(cls)
                    cls._instance.initialize(source)
        return cls._instance

    def initialize(self, source):
        """Hàm khởi tạo thực sự (chỉ chạy 1 lần)"""
        self.cap = cv2.VideoCapture(source)
        self.q = None          # Biến lưu frame mới nhất
        self.is_running = True # Cờ kiểm soát vòng lặp
        self.read_lock = threading.Lock() # Lock khi đọc/ghi frame

        if not self.cap.isOpened():
            raise ValueError("❌ Không thể mở Camera! Kiểm tra lại kết nối.")

        # Bắt đầu luồng đọc ảnh ngầm (Daemon thread sẽ tự tắt khi app tắt)
        self.thread = threading.Thread(target=self._update, daemon=True)
        self.thread.start()
        print("📸 Camera started in background thread.")

    def _update(self):
        """Hàm chạy ngầm: Liên tục đọc frame từ camera"""
        while self.is_running:
            ret, frame = self.cap.read()
            if ret:
                with self.read_lock:
                    self.q = frame
            else:
                # Nếu mất kết nối camera, thử kết nối lại hoặc log lỗi
                print("⚠️ Lost connection to camera!")
                time.sleep(1)
            
            # Sleep nhẹ để giảm tải CPU (quan trọng)
            time.sleep(0.01) 

    def get_frame(self):
        """Hàm cho API gọi: Lấy frame hiện tại"""
        with self.read_lock:
            return self.q

    def stop(self):
        """Giải phóng tài nguyên"""
        self.is_running = False
        if self.cap.isOpened():
            self.cap.release()