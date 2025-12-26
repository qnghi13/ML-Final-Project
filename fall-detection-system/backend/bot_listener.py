# bot_listener.py
import sys
import asyncio
import os
from dotenv import load_dotenv
from telegram import Update
from telegram.ext import ApplicationBuilder, ContextTypes, CommandHandler, Application
from telegram.request import HTTPXRequest

# Import hàm từ DB
from app.core.database import login_telegram_subscriber, init_db

load_dotenv()
TOKEN = os.getenv("TELEGRAM_TOKEN")

if not TOKEN:
    print("❌ Lỗi: Không tìm thấy TELEGRAM_TOKEN trong file .env")
    sys.exit(1)

init_db()

# --- CẤU HÌNH PROXY (SỬA LỖI TypeError: unexpected keyword argument 'proxy_url') ---
# Thay vì truyền vào hàm, ta dùng biến môi trường để thư viện tự nhận diện
# Nếu bạn dùng VPN (như 1.1.1.1), hãy bỏ comment 2 dòng os.environ bên dưới
#PROXY_ADDRESS = "http://127.0.0.1:1080" # Kiểm tra lại cổng Proxy của bạn (thường là 1080 hoặc 8080)
# os.environ["HTTP_PROXY"] = PROXY_ADDRESS
# os.environ["HTTPS_PROXY"] = PROXY_ADDRESS

# 1. Hướng dẫn người dùng
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "👋 Chào bạn!\n"
        "Để nhận cảnh báo từ hệ thống, vui lòng đăng nhập bằng tài khoản Web của bạn.\n\n"
        "👉 Cú pháp: `/login <tài_khoản> <mật_khẩu>`\n"
        "Ví dụ: `/login admin 123456`",
        parse_mode="Markdown"
    )

# 2. Xử lý lệnh /login
async def login_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    args = context.args 
    
    if len(args) != 2:
        await update.message.reply_text("⚠️ Sai cú pháp!\nVui lòng nhập: `/login <user> <pass>`", parse_mode="Markdown")
        return

    username = args[0]
    password = args[1]
    chat_id = str(update.effective_chat.id)
    full_name = update.effective_user.full_name or "Unknown"

    # Gọi DB xử lý
    success, message = login_telegram_subscriber(username, password, chat_id, full_name)
    
    await update.message.reply_text(message)
    
    # Xóa tin nhắn mật khẩu để bảo mật
    try:
        await update.message.delete()
    except:
        pass

async def main():
    print("🚀 Bot đang khởi động...")
    
    # Cấu hình Request với thời gian chờ lâu hơn (Fix lỗi TimedOut)
    # KHÔNG truyền proxy_url vào đây để tránh lỗi TypeError
    request = HTTPXRequest(
        connect_timeout=30.0,
        read_timeout=30.0,
        write_timeout=30.0
    )

    # Khởi tạo App (Chỉ 1 lần duy nhất)
    app = ApplicationBuilder().token(TOKEN).request(request).build()
    
    # Đăng ký lệnh
    app.add_handler(CommandHandler('start', start))
    app.add_handler(CommandHandler('login', login_handler))
    
    print("✅ Bot đã sẵn sàng nhận lệnh!")
    
    # Chạy Bot
    await app.initialize()
    await app.start()
    await app.updater.start_polling()
    
    # Giữ bot chạy mãi mãi
    stop_signal = asyncio.Event()
    await stop_signal.wait()

if __name__ == '__main__':
    # Fix lỗi EventLoop trên Windows
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("🛑 Đã dừng Bot.")