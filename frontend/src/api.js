const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

export const loginAdmin = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      username: username,
      password: password,
    }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Login failed");
  }
  return response.json();
};

export const addStudent = async (name, file) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/students/`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to add student");
  }
  return response.json();
};

export const getAllStudents = async () => {
  const response = await fetch(`${API_BASE_URL}/students/`);
  if (!response.ok) {
    throw new Error("Failed to fetch students");
  }
  return response.json();
};

export const recognizeFrame = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/recognition/recognize-frame`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to recognize frame");
  }
  return response.json();
};

export const addCameraStream = async (streamUrl) => {
  const response = await fetch(`${API_BASE_URL}/cameras/add?stream_url=${streamUrl}`, {
    method: "POST",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to add camera stream");
  }
  return response.json();
};

export const removeCameraStream = async (cameraId) => {
  const response = await fetch(`${API_BASE_URL}/cameras/${cameraId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to remove camera stream");
  }
  return response.json();
};

export const getCameraSnapshot = async (cameraId) => {
  const response = await fetch(`${API_BASE_URL}/cameras/${cameraId}/snapshot`);
  if (!response.ok) {
    throw new Error("Failed to get camera snapshot");
  }
  return response.blob(); // Get as blob for image display
};

export const getAttendanceRecords = async (skip = 0, limit = 100) => {
  const response = await fetch(`${API_BASE_URL}/attendance/?skip=${skip}&limit=${limit}`);
  if (!response.ok) {
    throw new Error("Failed to fetch attendance records");
  }
  return response.json();
};
