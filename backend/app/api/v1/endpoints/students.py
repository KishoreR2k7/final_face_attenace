from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
import numpy as np
import cv2
from backend.app.services.database import get_db, Student
from backend.app.services.training_service import TrainingService
from backend.app.services.recognition_service import FaceRecognitionService
from typing import List

router = APIRouter()

recognition_service = FaceRecognitionService() # Initialize once
training_service = TrainingService(recognition_service=recognition_service)

@router.post("/students/", response_model=dict)
async def add_student(
    name: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    contents = await file.read()
    np_image = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(np_image, cv2.IMREAD_COLOR)

    if image is None:
        raise HTTPException(status_code=400, detail="Could not decode image")

    db_student = training_service.generate_and_store_embedding(db, name, image)
    if db_student is None:
        raise HTTPException(status_code=400, detail="Face not detected or embedding could not be generated")

    return {"message": f"Student {db_student.name} added successfully with ID {db_student.id}"}

@router.get("/students/", response_model=List[dict])
async def get_all_students(db: Session = Depends(get_db)):
    students = training_service.get_all_students_list(db)
    return students
