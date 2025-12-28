import socketio

# Tạo Server Socket Async (hỗ trợ FastAPI)
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')

