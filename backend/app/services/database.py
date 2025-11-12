from sqlalchemy import create_engine, Column, Integer, String, LargeBinary, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import numpy as np
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./sql_app.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    roll_number = Column(String, unique=True, index=True)
    email = Column(String)
    photo_path = Column(String)
    embedding = Column(LargeBinary) # Store numpy array as bytes

    attendances = relationship("Attendance", back_populates="student")

    def get_embedding(self):
        return np.frombuffer(self.embedding, dtype=np.float32) if self.embedding else None

    def set_embedding(self, embedding_array):
        self.embedding = embedding_array.astype(np.float32).tobytes()

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    camera_id = Column(String)

    student = relationship("Student", back_populates="attendances")

def create_db_and_tables():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
