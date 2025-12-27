import uvicorn
import os
import socketio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Import Router (CHỈ CÒN auth VÀ video)
from app.api import auth, video 
from app.core.database import init_db
from app.core.socket_manager import sio

app = FastAPI()

# Cấu hình CORS (Cho phép Web React kết nối)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cấu hình folder ảnh
if not os.path.exists("alert_images"):
    os.makedirs("alert_images")
app.mount("/evidence", StaticFiles(directory="alert_images"), name="evidence")

init_db()

# ĐĂNG KÝ ROUTER
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(video.router, prefix="/api/video", tags=["Video"])

combined_app = socketio.ASGIApp(sio, app)

if __name__ == "__main__":
    uvicorn.run("app.main:combined_app", host="0.0.0.0", port=8000, reload=True)