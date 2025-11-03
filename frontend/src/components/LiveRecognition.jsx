import React, { useState, useRef, useEffect } from 'react';
import { getAllStudents, recognizeFrame, getCameraSnapshot } from '../api';

const LiveRecognition = () => {
  const [selectedCameraId, setSelectedCameraId] = useState('');
  const [students, setStudents] = useState([]);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [recognizedFaces, setRecognizedFaces] = useState([]);
  const [annotatedFrame, setAnnotatedFrame] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);

  // In a real app, you'd fetch a list of available cameras from the backend
  // For now, we'll use a mock list of camera IDs (from localStorage in AddCameraForm)
  const [availableCameras, setAvailableCameras] = useState([]);

  useEffect(() => {
    const storedCameras = JSON.parse(localStorage.getItem('cameraIds')) || [];
    setAvailableCameras(storedCameras);

    const fetchStudents = async () => {
      try {
        const fetchedStudents = await getAllStudents();
        setStudents(fetchedStudents);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to load students for recognition.");
      }
    };
    fetchStudents();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startRecognition = async () => {
    if (!selectedCameraId) {
      setError("Please select a camera.");
      return;
    }

    setIsRecognizing(true);
    setError(null);
    setRecognizedFaces([]);
    setAnnotatedFrame(null);

    let isProcessing = false;  // Prevent overlapping requests
    
    const processFrame = async () => {
      if (isProcessing) return;  // Skip if already processing
      
      isProcessing = true;
      try {
        const snapshotBlob = await getCameraSnapshot(selectedCameraId);
        const response = await recognizeFrame(snapshotBlob);
        setRecognizedFaces(response.recognized_faces);
        setAnnotatedFrame(`data:image/jpeg;base64,${response.annotated_frame}`);
      } catch (err) {
        setError(err.message || "Error during recognition.");
        stopRecognition();
      } finally {
        isProcessing = false;
      }
    };

    intervalRef.current = setInterval(processFrame, 300); // Poll every 300ms for very smooth video with GPU
  };

  const stopRecognition = () => {
    setIsRecognizing(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">Live Face Recognition</h3>
      
      <div>
        <label htmlFor="cameraSelect" className="block text-sm font-medium text-gray-700">Select Camera</label>
        <select
          id="cameraSelect"
          value={selectedCameraId}
          onChange={(e) => setSelectedCameraId(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          disabled={isRecognizing}
        >
          <option value="">-- Select a Camera --</option>
          {availableCameras.map(camera => (
            <option key={camera.id} value={camera.id}>
              Camera {camera.id} ({camera.url === "0" ? "Webcam" : camera.url})
            </option>
          ))}
        </select>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={startRecognition}
          disabled={isRecognizing || !selectedCameraId}
          className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          Start Recognition
        </button>
        <button
          onClick={stopRecognition}
          disabled={!isRecognizing}
          className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
        >
          Stop Recognition
        </button>
      </div>

      {error && <p className="mt-4 text-red-600 text-center">Error: {error}</p>}

      {isRecognizing && (
        <p className="mt-4 text-center text-blue-600">Recognizing...</p>
      )}
      {annotatedFrame && (
        <div className="mt-6">
          <h4 className="text-lg font-medium text-gray-800">Live Feed</h4>
          <img src={annotatedFrame} alt="Live Recognition Feed" className="mt-2 rounded-lg shadow-md w-full" />
        </div>
      )}

      {recognizedFaces.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-medium text-gray-800">Recognized Faces</h4>
          <ul className="mt-2 space-y-2">
            {recognizedFaces.map((face, index) => (
              <li key={index} className="bg-gray-50 p-3 rounded-md shadow-sm">
                Face {index + 1}: <strong>{face.name}</strong> (Confidence: {(face.confidence * 100).toFixed(2)}% | Similarity: {(face.similarity * 100).toFixed(2)}%)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LiveRecognition;
