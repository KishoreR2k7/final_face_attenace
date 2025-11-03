import cv2
import threading
import time
from collections import deque
import numpy as np

class VideoStreamWidget:
    def __init__(self, src=0, width=480, height=360, queue_size=128):
        self.stream = cv2.VideoCapture(src)
        self.stream.set(cv2.CAP_PROP_FRAME_WIDTH, width)
        self.stream.set(cv2.CAP_PROP_FRAME_HEIGHT, height)
        self.stream.set(cv2.CAP_PROP_FPS, 15)  # Limit FPS for CCTV
        self.stream.set(cv2.CAP_PROP_BUFFERSIZE, 1)  # Minimize buffer lag
        self.grabbed, self.frame = self.stream.read()
        self.started = False
        self.read_lock = threading.Lock()
        self.frames_queue = deque(maxlen=queue_size)

    def start(self):
        if self.started:
            print("[!] Asynchroneous video capturing has already been started.")
            return None
        self.started = True
        self.thread = threading.Thread(target=self.update, args=())
        self.thread.start()
        return self

    def update(self):
        while self.started:
            grabbed, frame = self.stream.read()
            with self.read_lock:
                self.grabbed = grabbed
                if grabbed:
                    # Add frame to queue if it's not full
                    if len(self.frames_queue) == self.frames_queue.maxlen:
                        self.frames_queue.popleft() # remove oldest frame
                    self.frames_queue.append(frame)
            time.sleep(0.01) # Small delay to prevent busy-waiting

    def read(self):
        with self.read_lock:
            if self.frames_queue:
                return self.grabbed, self.frames_queue.pop() # Get newest frame
            return self.grabbed, self.frame # return last read frame if queue is empty

    def stop(self):
        self.started = False
        self.thread.join()

    def __exit__(self, exc_type, exc_value, traceback):
        self.stream.release()


class LiveStreamService:
    def __init__(self):
        self.camera_streams = {}
        self.next_camera_id = 1

    def add_camera(self, stream_url: str):
        camera_id = self.next_camera_id
        self.next_camera_id += 1
        try:
            # Convert string "0" to integer if needed
            if stream_url.isdigit():
                stream_url = int(stream_url)
            stream_widget = VideoStreamWidget(stream_url).start()
            # Give it a moment to initialize
            time.sleep(0.5)
            self.camera_streams[camera_id] = stream_widget
            return camera_id
        except Exception as e:
            print(f"Error adding camera: {e}")
            return None

    def remove_camera(self, camera_id: int):
        if camera_id in self.camera_streams:
            self.camera_streams[camera_id].stop()
            del self.camera_streams[camera_id]
            return True
        return False

    def get_frame(self, camera_id: int):
        if camera_id in self.camera_streams:
            grabbed, frame = self.camera_streams[camera_id].read()
            if grabbed:
                return frame
        return None

    def get_all_cameras(self):
        """Return list of all camera IDs"""
        return list(self.camera_streams.keys())
