import cv2
from ultralytics import YOLO
import numpy as np

class FaceDetector:
    def __init__(self, model_name="yolov8n.pt"):
        self.model = YOLO(model_name)

    def detect_faces(self, image: np.ndarray):
        results = self.model(image, verbose=False)
        detections = []
        for r in results:
            for box in r.boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                confidence = box.conf[0]
                keypoints = None # YOLOv8n-face doesn't directly provide keypoints in same format as SCRFD
                detections.append({
                    "bbox": [x1, y1, x2, y2],
                    "confidence": confidence,
                    "keypoints": keypoints
                })
        return detections
