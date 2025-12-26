from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class AlertResponse(BaseModel):
    id: int
    timestamp: datetime
    confidence: float
    image_url: str  # Frontend cần field này để hiện ảnh

    class Config:
        from_attributes = True # Cho phép đọc từ dict hoặc object