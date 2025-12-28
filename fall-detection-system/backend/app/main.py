import uvicorn
import os
import socketio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# 1. Import các Router
from app.api import auth, video 
from app.core.database import init_db

# 2. QUAN TRỌNG: Import SIO từ file quản lý chung (KHÔNG TẠO MỚI)
from app.core.socket_manager import sio 

app = FastAPI()

# 3. Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Cấu hình folder ảnh
if not os.path.exists("alert_images"):
    os.makedirs("alert_images")
app.mount("/evidence", StaticFiles(directory="alert_images"), name="evidence")

# 5. Khởi tạo Database
init_db()

# 6. Đăng ký Router
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(video.router, prefix="/api/video", tags=["Video"])

# 7. Mount SocketIO vào FastAPI
# Dùng đúng biến 'sio' đã import ở trên
sio_app = socketio.ASGIApp(sio, socketio_path='socket.io')
app.mount('/socket.io', sio_app)

# 8. Sự kiện Socket
@sio.event
async def connect(sid, environ):
    print(f"✅ CLIENT CONNECTED: {sid}")

@sio.event
async def disconnect(sid):
    print(f"❌ CLIENT DISCONNECTED: {sid}")

# 9. Chạy Server
# Lưu ý: Chạy 'app' chứ không phải 'combined_app' vì ta đã mount rồi
if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)