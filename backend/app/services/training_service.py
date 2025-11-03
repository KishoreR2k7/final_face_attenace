import numpy as np
from sqlalchemy.orm import Session
from backend.app.services.recognition_service import FaceRecognitionService
from backend.app.services.database import Student
from typing import List

class TrainingService:
    def __init__(self, recognition_service: FaceRecognitionService):
        self.recognition_service = recognition_service

    def generate_and_store_embedding(self, db: Session, student_name: str, image_data: np.ndarray):
        embedding = self.recognition_service.get_face_embedding(image_data)
        if embedding is None:
            return None

        # Check if student already exists
        db_student = db.query(Student).filter(Student.name == student_name).first()
        
        if db_student:
            # Student exists, update their embedding by averaging with the new one
            existing_embedding = db_student.get_embedding()
            if existing_embedding is not None:
                # Average the embeddings to improve accuracy
                averaged_embedding = (existing_embedding + embedding) / 2
                # Normalize the averaged embedding
                averaged_embedding = averaged_embedding / np.linalg.norm(averaged_embedding)
                db_student.set_embedding(averaged_embedding)
            else:
                db_student.set_embedding(embedding)
            db.commit()
            db.refresh(db_student)
        else:
            # Create new student
            db_student = Student(name=student_name)
            db_student.set_embedding(embedding)
            db.add(db_student)
            db.commit()
            db.refresh(db_student)
        
        return db_student

    def load_all_student_embeddings(self, db: Session) -> List[dict]:
        students = db.query(Student).all()
        return [{
            "id": student.id,
            "name": student.name,
            "embedding": student.get_embedding()
        } for student in students if student.get_embedding() is not None]

    def get_all_students_list(self, db: Session) -> List[dict]:
        """Get all students without embeddings for display purposes"""
        students = db.query(Student).all()
        return [{
            "id": student.id,
            "name": student.name
        } for student in students]
