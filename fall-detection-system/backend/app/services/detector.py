import cv2
import time
import numpy as np
from ultralytics import YOLO
from collections import deque

class FallDetector:
    def __init__(self, model_path='model/best.pt', conf_threshold=0.5):
        # 1. Load Model Custom của bạn
        # Lưu ý: model_path phải trỏ đến file .pt ĐÃ TRAIN xong (thường là runs/detect/train/weights/best.pt)
        print(f"Loading custom model from {model_path}...")
        self.model = YOLO(model_path) 
        
        self.conf = conf_threshold
        
        # 2. Định nghĩa Classes theo Data Report của nhóm bạn 
        # 0: Fall Detected (Sự cố)
        # 1: Walking (Bình thường)
        # 2: Sitting (Bình thường)
        self.FALL_CLASS_ID = 0 
        
        # 3. Logic Time-series (Bộ lọc thời gian)
        # Deque lưu trạng thái 30 frames gần nhất
        self.history_buffer = deque(maxlen=30)
        self.confirm_threshold = 15 # Cần ít nhất 15/30 frame detect ngã để confirm
        
        # 4. Logic Cooldown (Chống Spam)
        self.last_alert_time = 0
        self.cooldown_duration = 60 # 60 giây im lặng sau khi báo động
        self.is_alert_active = False

    def detect(self, frame):
        """
        Input: Frame ảnh gốc
        Output: Frame đã vẽ box + Trạng thái Alert (True/False)
        """
        # Run inference
        results = self.model(frame, verbose=False, conf=self.conf)
        
        current_frame_has_fall = False
        
        # Vẽ box và check xem có class 0 (Fall) không
        for r in results:
            boxes = r.boxes
            for box in boxes:
                cls_id = int(box.cls[0])
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                conf = float(box.conf[0])
                
                # Setup màu sắc và nhãn hiển thị
                if cls_id == self.FALL_CLASS_ID:
                    # Phát hiện NGÃ
                    current_frame_has_fall = True
                    color = (0, 0, 255) # Đỏ
                    label = f"FALL {conf:.2f}"
                else:
                    # Các hành động bình thường (Walking/Sitting)
                    color = (0, 255, 0) # Xanh lá
                    # Lấy tên class từ model (Walking/Sitting)
                    class_name = self.model.names[cls_id]
                    label = f"{class_name} {conf:.2f}"

                # Vẽ bounding box
                cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                cv2.putText(frame, label, (x1, y1 - 10), 
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

        # === LOGIC QUYẾT ĐỊNH (The Brain) ===
        
        # 1. Cập nhật bộ nhớ đệm lịch sử
        self.history_buffer.append(current_frame_has_fall)
        
        # 2. Đếm số lượng frame ngã trong quá khứ gần (buffer)
        fall_count = sum(self.history_buffer)
        
        trigger_alert = False
        current_time = time.time()

        # 3. Kiểm tra ngưỡng xác nhận (15/30 frames là ngã)
        if fall_count >= self.confirm_threshold:
            # Nếu ĐANG trong thời gian cooldown
            if (current_time - self.last_alert_time) < self.cooldown_duration:
                # Chỉ hiển thị cảnh báo trên màn hình, KHÔNG gửi API
                self.is_alert_active = True
                trigger_alert = False 
            else:
                # Hết cooldown -> Kích hoạt gửi cảnh báo
                self.last_alert_time = current_time
                self.is_alert_active = True
                trigger_alert = True
                print(">>> CONFIRMED FALL! TRIGGERING ALERT SYSTEM <<<")
        else:
            # Nếu số lượng frame ngã giảm xuống dưới ngưỡng -> Tắt cảnh báo trên màn hình
            # (Nhưng cooldown vẫn giữ nguyên giá trị thời gian cũ)
            self.is_alert_active = False

        # Hiển thị trạng thái khẩn cấp lên màn hình video
        if self.is_alert_active:
            status_text = "WARNING: FALL DETECTED"
            # Nếu đang cooldown thì hiện thêm thời gian đếm ngược (Optional)
            if (current_time - self.last_alert_time) < self.cooldown_duration:
                remain = int(self.cooldown_duration - (current_time - self.last_alert_time))
                status_text += f" (Sent. Cooldown: {remain}s)"
            
            cv2.putText(frame, status_text, (20, 40), 
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

        return frame, trigger_alert