# bot_listener.py
import sys
import asyncio
import logging
from telegram import Update, KeyboardButton, ReplyKeyboardMarkup
from telegram.ext import ApplicationBuilder, ContextTypes, CommandHandler, MessageHandler, filters
from app.database import update_telegram_mapping, init_db

# --- THAY TOKEN CỦA BẠN VÀO ĐÂY ---
TOKEN = "8310192660:AAFbakBZZLF571Csl6WRLnkMzlJbRbqG2d4"  # <--- NHỚ DÁN TOKEN VÀO

# Đảm bảo DB đã tạo
init_db()

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    button = KeyboardButton("📱 Chia sẻ SĐT để nhận cảnh báo", request_contact=True)
    markup = ReplyKeyboardMarkup([[button]], one_time_keyboard=True, resize_keyboard=True)
    await update.message.reply_text(
        "Chào bạn! 👋\nĐể hệ thống AI gửi ảnh cảnh báo về đây, vui lòng bấm nút dưới để xác thực.",
        reply_markup=markup
    )

async def contact_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    contact = update.message.contact
    raw_phone = contact.phone_number
    chat_id = str(update.effective_chat.id)
    
    # --- ĐOẠN CODE SỬA LẠI (Thông minh hơn) ---
    # 1. Xóa khoảng trắng (nếu có)
    phone = raw_phone.replace(" ", "")
    
    # 2. Xử lý các đầu số khác nhau
    if phone.startswith('+84'):
        phone = '0' + phone[3:]
    elif phone.startswith('84'): # <--- ĐÂY LÀ TRƯỜNG HỢP CỦA BẠN
        phone = '0' + phone[2:]
    # ------------------------------------------

    print(f"[BOT] Telegram gửi: {raw_phone} -> Đã chuẩn hóa thành: {phone}")
    
    # Gọi DB để liên kết
    success, username = update_telegram_mapping(phone, chat_id)
    
    if success:
        await update.message.reply_text(f"✅ Đã liên kết thành công với tài khoản: {username}!\nSĐT: {phone}")
    else:
        await update.message.reply_text(
            f"⚠️ LỖI: Số điện thoại {phone} chưa được đăng ký trên Web.\n"
            f"👉 Vui lòng lên Web đăng ký tài khoản với SĐT là: {phone}"
        )
# --- ĐOẠN CODE QUAN TRỌNG ĐỂ FIX LỖI PYTHON 3.13 ---
async def main():
    print("🤖 Bot Telegram đang khởi động...")
    app = ApplicationBuilder().token(TOKEN).build()
    
    # Đăng ký các handler
    app.add_handler(CommandHandler('start', start))
    app.add_handler(MessageHandler(filters.CONTACT, contact_handler))

    # Chạy bot thủ công (An toàn hơn run_polling trên Windows)
    await app.initialize()
    await app.start()
    await app.updater.start_polling()
    
    # Giữ cho bot chạy mãi mãi
    print("✅ Bot đã chạy thành công! Đang chờ tin nhắn...")
    try:
        # Treo máy để chờ tin nhắn (ngủ vô tận)
        await asyncio.Event().wait()
    except KeyboardInterrupt:
        # Dừng bot nhẹ nhàng khi bấm Ctrl+C
        await app.updater.stop()
        await app.stop()
        await app.shutdown()

if __name__ == '__main__':
    # Ép kiểu chạy tương thích cho Windows
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass