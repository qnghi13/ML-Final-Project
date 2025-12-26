import socketio

# Tạo Server Socket Async (hỗ trợ FastAPI)
# cors_allowed_origins='*' để Frontend nào cũng kết nối được
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')

# Tạo App Socket (để wrap lấy FastAPI sau này)
socket_app = socketio.ASGIApp(sio)