# # bot_listener.py
# import sys
# import asyncio
# import logging
# from telegram import Update, KeyboardButton, ReplyKeyboardMarkup
# from telegram.ext import ApplicationBuilder, ContextTypes, CommandHandler, MessageHandler, filters
# from app.database import update_telegram_mapping, init_db
# import os 
# from dotenv import load_dotenv 

# load_dotenv()

# # --- THAY TOKEN CỦA BẠN VÀO ĐÂY ---
# TOKEN = os.getenv("TELEGRAM_TOKEN")  # <--- NHỚ DÁN TOKEN VÀO

# if not TOKEN:
#     print("❌ LỖI: Chưa cấu hình TELEGRAM_TOKEN trong file .env")
#     sys.exit(1)
    
# # Đảm bảo DB đã tạo
# init_db()

# async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
#     button = KeyboardButton("📱 Chia sẻ SĐT để nhận cảnh báo", request_contact=True)
#     markup = ReplyKeyboardMarkup([[button]], one_time_keyboard=True, resize_keyboard=True)
#     await update.message.reply_text(
#         "Chào bạn! 👋\nĐể hệ thống AI gửi ảnh cảnh báo về đây, vui lòng bấm nút dưới để xác thực.",
#         reply_markup=markup
#     )

# async def contact_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
#     contact = update.message.contact
#     raw_phone = contact.phone_number
#     chat_id = str(update.effective_chat.id)
    
#     # --- ĐOẠN CODE SỬA LẠI (Thông minh hơn) ---
#     # 1. Xóa khoảng trắng (nếu có)
#     phone = raw_phone.replace(" ", "")
    
#     # 2. Xử lý các đầu số khác nhau
#     if phone.startswith('+84'):
#         phone = '0' + phone[3:]
#     elif phone.startswith('84'): # <--- ĐÂY LÀ TRƯỜNG HỢP CỦA BẠN
#         phone = '0' + phone[2:]
#     # ------------------------------------------

#     print(f"[BOT] Telegram gửi: {raw_phone} -> Đã chuẩn hóa thành: {phone}")
    
#     # Gọi DB để liên kết
#     success, username = update_telegram_mapping(phone, chat_id)
    
#     if success:
#         await update.message.reply_text(f"✅ Đã liên kết thành công với tài khoản: {username}!\nSĐT: {phone}")
#     else:
#         await update.message.reply_text(
#             f"⚠️ LỖI: Số điện thoại {phone} chưa được đăng ký trên Web.\n"
#             f"👉 Vui lòng lên Web đăng ký tài khoản với SĐT là: {phone}"
#         )
# # --- ĐOẠN CODE QUAN TRỌNG ĐỂ FIX LỖI PYTHON 3.13 ---
# async def main():
#     print("🤖 Bot Telegram đang khởi động...")
#     app = ApplicationBuilder().token(TOKEN).build()
    
#     # Đăng ký các handler
#     app.add_handler(CommandHandler('start', start))
#     app.add_handler(MessageHandler(filters.CONTACT, contact_handler))

#     # Chạy bot thủ công (An toàn hơn run_polling trên Windows)
#     await app.initialize()
#     await app.start()
#     await app.updater.start_polling()
    
#     # Giữ cho bot chạy mãi mãi
#     print("✅ Bot đã chạy thành công! Đang chờ tin nhắn...")
#     try:
#         # Treo máy để chờ tin nhắn (ngủ vô tận)
#         await asyncio.Event().wait()
#     except KeyboardInterrupt:
#         # Dừng bot nhẹ nhàng khi bấm Ctrl+C
#         await app.updater.stop()
#         await app.stop()
#         await app.shutdown()

# if __name__ == '__main__':
#     # Ép kiểu chạy tương thích cho Windows
#     if sys.platform == "win32":
#         asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    
#     try:
#         asyncio.run(main())
#     except KeyboardInterrupt:
#         pass

#backend/bot_listener.py

import telebot
import os
from dotenv import load_dotenv
from app.database import update_telegram_mapping

# Load biến môi trường
load_dotenv()
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")

# Khởi tạo Bot
bot = telebot.TeleBot(TELEGRAM_TOKEN)

print("🤖 Bot Telegram đang chạy... (Đang lắng nghe)")

@bot.message_handler(commands=['start', 'help'])
def send_welcome(message):
    bot.reply_to(message, "Chào bạn! Để nhận cảnh báo, vui lòng gửi lệnh: /register [SỐ_ĐIỆN_THOẠI]\nVí dụ: /register 0909123456")

@bot.message_handler(commands=['register'])
def register_phone(message):
    try:
        parts = message.text.split()
        if len(parts) < 2:
            bot.reply_to(message, "⚠️ Sai cú pháp. Vui lòng nhập: /register [SỐ_ĐIỆN_THOẠI]")
            return
        
        phone_number = parts[1]
        chat_id = str(message.chat.id)
        
        # Gọi hàm DB để map user
        success, username = update_telegram_mapping(phone_number, chat_id)
        
        if success:
            bot.reply_to(message, f"✅ Đã liên kết thành công với tài khoản: {username}!\nTừ giờ bạn sẽ nhận được cảnh báo kèm ảnh.")
        else:
            bot.reply_to(message, f"❌ Không tìm thấy SĐT {phone_number} trong hệ thống.\nHãy chắc chắn bạn đã đăng ký tài khoản trên Web trước.")
            
    except Exception as e:
        bot.reply_to(message, "Lỗi xử lý hệ thống.")
        print(f"Error: {e}")

# Chạy bot liên tục
if __name__ == "__main__":
    try:
        bot.infinity_polling()
    except Exception as e:
        print(f"Bot crash: {e}")