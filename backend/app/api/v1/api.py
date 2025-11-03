from fastapi import APIRouter

from backend.app.api.v1.endpoints import auth, students, recognition, cameras, attendance

api_router = APIRouter()
api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(students.router, tags=["students"])
api_router.include_router(recognition.router, tags=["recognition"])
api_router.include_router(cameras.router, tags=["cameras"])
api_router.include_router(attendance.router, tags=["attendance"])
