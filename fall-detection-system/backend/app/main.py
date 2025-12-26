# # app/main.py
# import uvicorn
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.staticfiles import StaticFiles
# from app.socket_manager import socket_app
# # Import các thành phần
# from app.database import init_db
# from app.api import auth, video  # Import 2 file con vừa tạo

# # 1. Khởi tạo DB
# init_db()

# # 2. Khởi tạo App
# app = FastAPI(title="Hệ thống Cảnh báo Đột quỵ (AIoT)")
# app.mount("/", socket_app)
# # 3. Cấu hình CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # 4. Mount thư mục ảnh tĩnh
# app.mount("/static", StaticFiles(directory="evidence"), name="static")

# # 5. KẾT HỢP ROUTER (Gom file con về file chính)
# app.include_router(auth.router, prefix="/api/auth")   # Các API Auth sẽ có dạng /api/auth/login
# app.include_router(video.router)                      # API Video giữ nguyên /video_feed

# @app.get("/")
# def root():
#     return {"message": "Hệ thống đang chạy ngon lành!"}

# if __name__ == "__main__":
#     uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)


# app/main.py
import uvicorn
import socketio # Cần import thư viện này
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# ⚠️ THAY ĐỔI: Import 'sio' gốc, KHÔNG import 'socket_app'
from app.socket_manager import sio 

from app.database import init_db
from app.api import auth, video, history

# 1. Khởi tạo DB
init_db()

# 2. Khởi tạo App FastAPI
app = FastAPI(title="Hệ thống Cảnh báo Đột quỵ (AIoT)")

# ❌ XÓA DÒNG NÀY: app.mount("/", socket_app) 

# 3. Cấu hình CORS (Middleware của FastAPI)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Mount thư mục ảnh tĩnh
app.mount("/static", StaticFiles(directory="evidence"), name="static")

# 5. KẾT HỢP ROUTER
app.include_router(auth.router, prefix="/api/auth")
app.include_router(video.router)
app.include_router(history.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Hệ thống đang chạy ngon lành!"}

# 6. ✨ BƯỚC QUAN TRỌNG NHẤT: WRAP APP ✨
# Biến 'app' bây giờ sẽ là ứng dụng SocketIO, chứa FastAPI bên trong
# Nó sẽ tự động điều hướng: /socket.io/ -> sio, còn lại -> FastAPI
app = socketio.ASGIApp(sio, app)

if __name__ == "__main__":
    # Lưu ý: reload=True có thể xung đột nhẹ với socketio trên Windows trong một số case, 
    # nhưng để dev thì vẫn ổn.
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)