from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.services.database import get_db, Attendance, Student
from typing import List
from datetime import datetime

router = APIRouter()

@router.get("/attendance/", response_model=List[dict])
async def get_attendance_records(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    attendance_records = db.query(Attendance).offset(skip).limit(limit).all()
    
    results = []
    for record in attendance_records:
        student = db.query(Student).filter(Student.id == record.student_id).first()
        results.append({
            "id": record.id,
            "student_id": record.student_id,
            "student_name": student.name if student else "Unknown",
            "timestamp": record.timestamp.isoformat()
        })
    return results
