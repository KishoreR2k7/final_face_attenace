import numpy as np
import insightface
from insightface.app import FaceAnalysis
from typing import List, Dict, Any
from scipy.spatial.distance import cosine
import cv2 # Added for image preprocessing

class FaceRecognitionService:
    def __init__(self):
        # Initialize FaceAnalysis with the antelopev2 model pack, which includes both detector and recognizer.
        # This satisfies the internal 'detection' model assertion in InsightFace.
        # We will still use YOLOv8n-face for actual detection in our pipeline.
        # Try GPU first, fallback to CPU if GPU not available
        providers = ['CUDAExecutionProvider', 'CPUExecutionProvider']
        
        self.app = FaceAnalysis(
            name='buffalo_l', 
            root='./models', 
            providers=providers
        )
        # GPU can handle larger det_size, use 320x320 for better accuracy at high speed
        try:
            self.app.prepare(ctx_id=0, det_size=(320, 320), det_thresh=0.5)
            print(f"✓ Face Recognition initialized with GPU acceleration")
        except:
            # Fallback to smaller size if GPU memory limited
            self.app.prepare(ctx_id=0, det_size=(192, 192), det_thresh=0.6)
            print(f"✓ Face Recognition initialized (CPU mode)")

    def get_face_embedding(self, face_image: np.ndarray) -> np.ndarray:
        """
        Get face embedding from a face image.
        The face_image can be either a full image (we'll detect and crop) or a cropped face.
        """
        # Use InsightFace's built-in detection and recognition
        faces = self.app.get(face_image)
        
        if len(faces) == 0:
            print("No face detected in the image")
            return None
        
        # Get the first face detected
        face = faces[0]
        
        # The embedding is already computed by InsightFace
        embedding = face.embedding
        
        return embedding

    def compare_embeddings(self, embedding1: np.ndarray, embedding2: np.ndarray, threshold: float = 0.6) -> bool:
        if embedding1 is None or embedding2 is None:
            return False
        # Cosine distance is 1 - cosine similarity. Lower distance means higher similarity.
        distance = cosine(embedding1, embedding2)
        return distance < threshold

    def find_match(self, new_embedding: np.ndarray, registered_students: List[Dict[str, Any]], threshold: float = 0.6) -> (str, float):
        if new_embedding is None:
            return "Unknown", 0.0

        min_distance = float('inf')
        matched_student_name = "Unknown"

        for student in registered_students:
            student_embedding = student["embedding"]
            if student_embedding is None:
                continue

            distance = cosine(new_embedding, student_embedding)

            if distance < min_distance:
                min_distance = distance
                matched_student_name = student["name"]
        
        if min_distance < threshold:
            return matched_student_name, 1 - min_distance # Return similarity
        else:
            return "Unknown", 1 - min_distance # Return similarity even if not matched
