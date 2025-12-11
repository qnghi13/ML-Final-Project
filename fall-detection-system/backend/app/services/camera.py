import cv2

class VideoCamera:
    def __init__(self, source=0):
        """
        Khởi tạo Camera.
        source: 0 (Webcam laptop), 1 (Webcam rời), hoặc đường dẫn RTSP (IP Camera)
        """
        self.cap = cv2.VideoCapture(source)
        if not self.cap.isOpened():
            raise ValueError("Không thể mở Camera. Hãy kiểm tra lại kết nối!")

    def __del__(self):
        # Giải phóng camera khi class bị hủy
        if self.cap.isOpened():
            self.cap.release()

    def get_frame(self):
        """
        Đọc 1 frame từ camera.
        Return: Frame ảnh (numpy array) hoặc None nếu lỗi.
        """
        if self.cap.isOpened():
            ret, frame = self.cap.read()
            if ret:
                # Resize ảnh nếu cần (để tăng tốc độ xử lý cho model)
                # frame = cv2.resize(frame, (640, 640)) 
                return frame
        return None