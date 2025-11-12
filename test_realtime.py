import httpx
import cv2
import numpy as np
import base64

# Assuming FastAPI app is running on http://127.0.0.1:8000
BASE_URL = "http://127.0.0.1:8000/api/v1"

async def test_add_student():
    print("\n--- Testing Add Student ---")
    # Create a dummy image for testing
    dummy_image = np.zeros((200, 200, 3), dtype=np.uint8)
    cv2.putText(dummy_image, "Test Face", (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
    _, img_encoded = cv2.imencode('.png', dummy_image)
    image_bytes = img_encoded.tobytes()

    async with httpx.AsyncClient() as client:
        files = {"file": ("test_face.png", image_bytes, "image/png")}
        data = {"name": "John Doe"}
        response = await client.post(f"{BASE_URL}/students/", files=files, data=data)
        print(f"Add Student Status: {response.status_code}")
        print(f"Add Student Response: {response.json()}")

async def test_recognize_frame():
    print("\n--- Testing Recognize Frame ---")
    # Create a dummy image for testing recognition
    dummy_image = np.zeros((200, 200, 3), dtype=np.uint8)
    cv2.putText(dummy_image, "Recognize Face", (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
    _, img_encoded = cv2.imencode('.jpg', dummy_image)
    image_bytes = img_encoded.tobytes()

    async with httpx.AsyncClient() as client:
        files = {"file": ("recognize_face.jpg", image_bytes, "image/jpeg")}
        response = await client.post(f"{BASE_URL}/recognition/recognize-frame", files=files)
        print(f"Recognize Frame Status: {response.status_code}")
        json_response = response.json()
        print(f"Recognized Faces: {json_response.get("recognized_faces")}")
        # Decode and display annotated frame if available
        # if "annotated_frame" in json_response:
        #     img_data = base64.b64decode(json_response["annotated_frame"])
        #     np_arr = np.frombuffer(img_data, np.uint8)
        #     img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        #     cv2.imshow("Annotated Frame", img)
        #     cv2.waitKey(0)
        #     cv2.destroyAllWindows()

async def test_auth_login():
    print("\n--- Testing Admin Login ---")
    async with httpx.AsyncClient() as client:
        data = {"username": "admin", "password": "adminpass"}
        response = await client.post(f"{BASE_URL}/auth/login", data=data)
        print(f"Login Status: {response.status_code}")
        print(f"Login Response: {response.json()}")

async def test_add_camera_and_snapshot():
    print("\n--- Testing Add Camera and Snapshot ---")
    # You might need a valid RTSP/HTTP stream URL here for a real test
    test_stream_url = "0" # Use 0 for default webcam, or a dummy URL for now
    async with httpx.AsyncClient() as client:
        # Add camera
        response = await client.post(f"{BASE_URL}/cameras/add", params={"stream_url": test_stream_url})
        print(f"Add Camera Status: {response.status_code}")
        add_camera_response = response.json()
        print(f"Add Camera Response: {add_camera_response}")
        camer_id = add_camera_response.get("camer_id")

        if camer_id:
            # Get snapshot
            response = await client.get(f"{BASE_URL}/cameras/{camer_id}/snapshot")
            print(f"Get Snapshot Status: {response.status_code}")
            # You can save the image to verify
            if response.status_code == 200:
                with open(f"camera_{camer_id}_snapshot.jpg", "wb") as f:
                    f.write(response.content)
                print(f"Snapshot saved as camera_{camer_id}_snapshot.jpg")
            
            # Remove camera
            response = await client.delete(f"{BASE_URL}/cameras/{camer_id}")
            print(f"Remove Camera Status: {response.status_code}")
            print(f"Remove Camera Response: {response.json()}")

async def test_get_attendance_records():
    print("\n--- Testing Get Attendance Records ---")
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}/attendance/")
        print(f"Get Attendance Status: {response.status_code}")
        print(f"Get Attendance Response: {response.json()}")

async def main():
    await test_auth_login()
    await test_add_student()
    await test_recognize_frame()
    await test_add_camera_and_snapshot()
    await test_get_attendance_records()

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
