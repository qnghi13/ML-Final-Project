# app/services/notifier.py
import requests
import os
import threading
from dotenv import load_dotenv
# Import đúng tên hàm mới trong database
from app.core.database import get_subscribers_by_phone, update_alert_sent_status

load_dotenv()
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")

def send_telegram_alert(user_phone: str, image_path: str, alert_id: int):
    """
    Hàm gửi cảnh báo tới TOÀN BỘ người thân của user_phone.
    Chạy trong thread riêng để không làm đơ camera.
    """
    def _send_task():
        # 1. Lấy danh sách Chat ID từ DB
        chat_ids = get_subscribers_by_phone(user_phone)
        
        if not chat_ids:
            print(f"⚠️ [Notifier] Không tìm thấy người thân nào liên kết với SĐT: {user_phone}")
            return

        print(f"🚨 [Notifier] Bắt đầu gửi cảnh báo tới {len(chat_ids)} người...")
        
        sent_count = 0
        
        # 2. Gửi ảnh cho từng người
        for chat_id in chat_ids:
            try:
                with open(image_path, 'rb') as f:
                    url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendPhoto"
                    payload = {
                        'chat_id': chat_id,
                        'caption': f"🚨 CẢNH BÁO: Phát hiện té ngã!\nSĐT người thân: {user_phone}\nThời gian: Ngay lúc này."
                    }
                    files = {'photo': f}
                    resp = requests.post(url, data=payload, files=files, timeout=10)
                    
                    if resp.status_code == 200:
                        print(f" -> ✅ Đã gửi tới {chat_id}")
                        sent_count += 1
                    else:
                        print(f" -> ❌ Lỗi gửi {chat_id}: {resp.text}")
                        
            except Exception as e:
                print(f" -> ❌ Lỗi kết nối tới {chat_id}: {e}")

        # 3. Nếu gửi được ít nhất cho 1 người -> Update trạng thái vào DB
        if sent_count > 0:
            update_alert_sent_status(alert_id, is_sent=True)
            print("✅ [Notifier] Đã cập nhật trạng thái cảnh báo vào DB.")

    # Chạy ngầm trong luồng khác (Thread) để API video không bị khựng lại
    thread = threading.Thread(target=_send_task)
    thread.start()