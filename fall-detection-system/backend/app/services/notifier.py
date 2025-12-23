# app/services/notifier.py
import requests
import threading
import os
from datetime import datetime
from app.database import get_linked_chat_ids

# --- THAY TOKEN GIỐNG BÊN FILE BOT ---
TELEGRAM_TOKEN = "8310192660:AAFbakBZZLF571Csl6WRLnkMzlJbRbqG2d4"

def send_alert_task(image_path, confidence):
    """Hàm gửi tin nhắn thực sự"""
    try:
        # 1. Lấy danh sách người nhận
        chat_ids = get_linked_chat_ids()
        if not chat_ids:
            print("[Notify] Chưa có ai liên kết Telegram. Không gửi được.")
            return

        # 2. Chuẩn bị nội dung
        time_str = datetime.now().strftime("%H:%M:%S - %d/%m/%Y")
        caption = (
            f"🚨 CẢNH BÁO: PHÁT HIỆN NGÃ!\n"
            f"🕒 Thời gian: {time_str}\n"
            f"📊 Độ tin cậy: {confidence:.2f}\n"
            f"⚠️ Vui lòng kiểm tra ngay!"
        )
        url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendPhoto"

        # 3. Gửi cho từng người
        if os.path.exists(image_path):
            with open(image_path, 'rb') as f:
                img_data = f.read()
                
            for chat_id in chat_ids:
                try:
                    requests.post(
                        url,
                        data={'chat_id': chat_id, 'caption': caption},
                        files={'photo': ('alert.jpg', img_data)},
                        timeout=10
                    )
                    print(f"[Notify] -> Đã gửi tới {chat_id}")
                except Exception as e:
                    print(f"[Notify Error] Gửi tới {chat_id} thất bại: {e}")
        else:
            print("[Notify] Không tìm thấy file ảnh")

    except Exception as e:
        print(f"[Notify Error] {e}")

def run_async_telegram(image_path, confidence):
    """Chạy đa luồng để không lag camera"""
    t = threading.Thread(target=send_alert_task, args=(image_path, confidence))
    t.start()