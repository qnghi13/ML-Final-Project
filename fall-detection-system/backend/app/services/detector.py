import cv2
import time
import numpy as np
from ultralytics import YOLO

class FallDetector:
    def __init__(self, model_path='model/best.pt', conf_threshold=0.6):
        print(f"Loading smart model from {model_path}...")
        self.model = YOLO(model_path) 
        self.conf = conf_threshold
        
        # Cấu hình Class ID (Cần đúng với model train của bạn)
        self.FALL_CLASS_ID = 0
        
        # === CẤU HÌNH THÔNG MINH ===
        
        # 1. Lọc nhiễu (Vấn đề Keypoints/Kích thước)
        # Chỉ detect nếu diện tích box chiếm ít nhất 2% khung hình
        # Giúp loại bỏ người đi ở quá xa hoặc vật thể nhỏ bị nhận nhầm
        self.MIN_BOX_AREA_RATIO = 0.02 
        
        # 2. Cấu hình Thời gian (Vấn đề 15/30 frame)
        # Thay vì đếm frame, ta đếm giây.
        self.TIME_TO_CONFIRM_FALL = 1.0   # Phải phát hiện ngã liên tục 1.0s mới coi là ngã thật (tránh glitch)
        self.TIME_TO_ALERT_STROKE = 5.0  # (Demo để 5s, thực tế nên 10-20s) Sau 5s nằm im -> Báo động Đỏ
        
        # Biến lưu trạng thái thời gian
        self.fall_start_time = None       # Thời điểm bắt đầu thấy ngã
        self.confirmed_fall_time = None   # Thời điểm xác nhận đã ngã (sau 1s)
        self.last_alert_time = 0
        self.cooldown_duration = 60       # 60s không spam tin nhắn
        
        self.is_falling_now = False       # Trạng thái tức thời của frame hiện tại

    def detect(self, frame):
        """
        Input: Frame ảnh
        Output: Frame vẽ box, status_code (0:Bình thường, 1:Cảnh báo vàng, 2:Báo động đỏ), confidence
        """
        h_img, w_img, _ = frame.shape
        frame_area = h_img * w_img
        
        # Run inference
        results = self.model(frame, verbose=False, conf=self.conf)
        
        self.is_falling_now = False
        max_conf = 0.0
        best_box = None

        # --- BƯỚC 1: LỌC DỮ LIỆU ĐẦU VÀO ---
        for r in results:
            boxes = r.boxes
            for box in boxes:
                # Tính diện tích box
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                w_box = x2 - x1
                h_box = y2 - y1
                box_area = w_box * h_box
                
                # Filter 1: Nếu box quá nhỏ (người quá xa/nhiễu) -> Bỏ qua
                if (box_area / frame_area) < self.MIN_BOX_AREA_RATIO:
                    continue
                
                # Logic xác định class
                cls_id = int(box.cls[0])
                conf = float(box.conf[0])
                
                # Ưu tiên lấy box có độ tin cậy cao nhất trong frame
                if conf > max_conf:
                    max_conf = conf
                    best_box = (x1, y1, x2, y2, cls_id, conf)
                    if cls_id == self.FALL_CLASS_ID:
                        self.is_falling_now = True

        # --- BƯỚC 2: LOGIC THỜI GIAN (STATE MACHINE) ---
        current_time = time.time()
        status_code = 0 # 0: Normal
        alert_msg = ""
        color = (0, 255, 0) # Green

        if self.is_falling_now:
            # Nếu mới bắt đầu ngã (frame trước chưa ngã)
            if self.fall_start_time is None:
                self.fall_start_time = current_time
            
            # Tính thời gian đã duy trì tư thế ngã
            duration = current_time - self.fall_start_time
            
            if duration < self.TIME_TO_CONFIRM_FALL:
                # Giai đoạn lọc nhiễu (< 1s): Chưa làm gì cả, chỉ vẽ màu cam
                color = (0, 165, 255) # Orange
                alert_msg = f"Validating... {duration:.1f}s"
                
            elif duration < self.TIME_TO_ALERT_STROKE:
                # Giai đoạn Cảnh báo Vàng (> 1s nhưng < 5s): Xác nhận ngã, đang chờ xem có dậy không
                status_code = 1 
                color = (0, 0, 255) # Red
                remaining = int(self.TIME_TO_ALERT_STROKE - duration)
                alert_msg = f"FALL DETECTED! Waiting: {remaining}s"
                
            else:
                # Giai đoạn Báo động Đỏ (> 5s): Người dùng KHÔNG dậy -> Đột quỵ/Ngất
                # Kiểm tra Cooldown để gửi tin nhắn
                if (current_time - self.last_alert_time) > self.cooldown_duration:
                    status_code = 2 # Gửi API
                    self.last_alert_time = current_time
                    print(">>> CRITICAL: STROKE ALERT SENT! <<<")
                
                color = (0, 0, 255)
                alert_msg = "CRITICAL: STROKE ALERT!!!"
        else:
            # Nếu frame này không thấy ngã -> Reset bộ đếm
            # (Có thể thêm logic 'grace period': mất dấu 0.5s chưa reset ngay để mượt hơn)
            self.fall_start_time = None
            alert_msg = "Normal"

        # --- BƯỚC 3: VẼ (VISUALIZATION) ---
        if best_box:
            x1, y1, x2, y2, cls, conf = best_box
            # Vẽ Box
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            # Vẽ Nhãn + Thời gian
            label = f"{alert_msg} ({conf:.2f})"
            cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

        # Vẽ thanh trạng thái trên cùng
        if self.fall_start_time is not None:
             cv2.putText(frame, f"Fall Duration: {current_time - self.fall_start_time:.1f}s", (10, 30), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

        return frame, status_code, max_conf