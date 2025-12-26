# backend/app/socket_manager.py
import socketio

# 1. Khởi tạo Async Server (Vì FastAPI chạy Async)
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins='*' # Quan trọng: Cho phép Frontend (localhost:5173) kết nối
)

# 2. Tạo ASGI App để mount vào FastAPI
socket_app = socketio.ASGIApp(sio)

# 3. Sự kiện connect (để debug xem Frontend có nối được ko)
@sio.event
async def connect(sid, environ):
    print(f"[Socket] Client connected: {sid}")

@sio.event
async def disconnect(sid):
    print(f"[Socket] Client disconnected: {sid}")