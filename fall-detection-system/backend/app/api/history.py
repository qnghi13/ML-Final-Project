# app/api/history.py
from fastapi import APIRouter, HTTPException
from typing import List
from app.database import get_all_alerts
from app.schemas import AlertResponse

router = APIRouter(tags=["History"])

@router.get("/alerts", response_model=List[AlertResponse])
def read_alerts():
    """API trả về danh sách lịch sử ngã"""
    alerts = get_all_alerts()
    return alerts