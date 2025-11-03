from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import numpy as np
import cv2
from backend.app.services.face_detection import FaceDetector
from backend.app.services.recognition_service import FaceRecognitionService
from backend.app.services.training_service import TrainingService
from backend.app.services.database import get_db, Attendance
from fastapi import UploadFile, File
from io import BytesIO
from PIL import Image
import base64
from datetime import datetime, timedelta

router = APIRouter()

face_detector = FaceDetector()
recognition_service = FaceRecognitionService()
training_service = TrainingService(recognition_service=recognition_service)

# Cache student embeddings to avoid loading from DB every frame
_student_cache = {"data": None, "last_update": None}
_attendance_cooldown = {}  # Track last attendance time for each student

def get_cached_students(db: Session):
    """Load students from cache or DB if cache is old"""
    now = datetime.now()
    if (_student_cache["data"] is None or 
        _student_cache["last_update"] is None or 
        (now - _student_cache["last_update"]).seconds > 30):  # Refresh every 30 seconds
        _student_cache["data"] = training_service.load_all_student_embeddings(db)
        _student_cache["last_update"] = now
    return _student_cache["data"]

@router.post("/recognition/recognize-frame")
async def recognize_frame(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    contents = await file.read()
    np_image = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(np_image, cv2.IMREAD_COLOR)

    if image is None:
        raise HTTPException(status_code=400, detail="Could not decode image")

    # Resize image for faster processing (GPU can handle 480px easily)
    h, w = image.shape[:2]
    if w > 480:
        scale = 480 / w
        image = cv2.resize(image, (480, int(h * scale)), interpolation=cv2.INTER_LINEAR)
        h, w = image.shape[:2]

    recognized_faces = []
    registered_students = get_cached_students(db)  # Use cache

    # Use InsightFace for faster detection and recognition with GPU
    faces = recognition_service.app.get(image, max_num=10)  # GPU can handle more faces
    
    for face in faces:
        bbox = face.bbox.astype(int)
        x1, y1, x2, y2 = bbox
        
        # Face embedding is already computed by InsightFace
        embedding = face.embedding
        name, similarity = recognition_service.find_match(embedding, registered_students)

        recognized_faces.append({
            "bbox": [int(x1), int(y1), int(x2), int(y2)],
            "confidence": float(face.det_score),
            "name": name,
            "similarity": float(similarity)
        })
        
        if name != "Unknown":
            # Record attendance only once per 5 minutes per student
            student_id = next((s["id"] for s in registered_students if s["name"] == name), None)
            if student_id:
                now = datetime.now()
                last_recorded = _attendance_cooldown.get(student_id)
                
                # Only record if more than 5 minutes since last attendance
                if last_recorded is None or (now - last_recorded) > timedelta(minutes=5):
                    attendance = Attendance(student_id=student_id)
                    db.add(attendance)
                    db.commit()
                    _attendance_cooldown[student_id] = now

    # Encode the image with bounding boxes for response (higher quality with GPU)
    for face in recognized_faces:
        x1, y1, x2, y2 = face["bbox"]
        name = face["name"]
        color = (0, 255, 0) if name != "Unknown" else (0, 0, 255) # Green for known, Red for unknown
        cv2.rectangle(image, (x1, y1), (x2, y2), color, 2)
        cv2.putText(image, name, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)
    
    # Convert annotated image to base64 string with better quality (GPU is fast)
    _, buffer = cv2.imencode('.jpg', image, [cv2.IMWRITE_JPEG_QUALITY, 85])  # 85% quality
    jpg_as_text = base64.b64encode(buffer).decode('utf-8')

    return {"recognized_faces": recognized_faces, "annotated_frame": jpg_as_text}
