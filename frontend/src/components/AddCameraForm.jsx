import React, { useState, useEffect } from 'react';
import { addCameraStream, removeCameraStream } from '../api';

function AddCameraForm() {
  const [streamUrl, setStreamUrl] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [cameras, setCameras] = useState([]); // This will store active camera IDs

  // For simplicity, we'll manage a mock list of camera IDs here
  // In a real application, you would fetch active camera streams from the backend
  useEffect(() => {
    // In a real app, you'd have an endpoint to get all active camera IDs
    // For now, we'll simulate an empty initial state or load from local storage if any were added.
    const storedCameras = JSON.parse(localStorage.getItem('cameraIds')) || [];
    setCameras(storedCameras);
  }, []);

  const handleAddCamera = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!streamUrl) {
      setError('Please provide a stream URL.');
      return;
    }

    try {
  const response = await addCameraStream(streamUrl);
  setMessage(response.message);
  const newCameraId = response.camera_id || response.cameraId || response.cameraId;
  const updatedCameras = [...cameras, { id: newCameraId, url: streamUrl }];
      setCameras(updatedCameras);
      localStorage.setItem('cameraIds', JSON.stringify(updatedCameras));
      setStreamUrl('');
    } catch (err) {
      setError(err.message || 'Failed to add camera stream.');
    }
  };

  const handleRemoveCamera = async (cameraId) => {
    setMessage('');
    setError('');
    try {
      const response = await removeCameraStream(cameraId);
      setMessage(response.message);
      const updatedCameras = cameras.filter(cam => cam.id !== cameraId);
      setCameras(updatedCameras);
      localStorage.setItem('cameraIds', JSON.stringify(updatedCameras));
    } catch (err) {
      setError(err.message || 'Failed to remove camera stream.');
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">Add New Camera Stream</h3>
      <form onSubmit={handleAddCamera} className="space-y-4">
        <div>
          <label htmlFor="streamUrl" className="block text-sm font-medium text-gray-700">Stream URL (e.g., rtsp://... or 0 for webcam)</label>
          <input
            type="text"
            id="streamUrl"
            value={streamUrl}
            onChange={(e) => setStreamUrl(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add Camera
        </button>
      </form>

      {message && <p className="mt-4 text-green-600 text-center">{message}</p>}
      {error && <p className="mt-4 text-red-600 text-center">Error: {error}</p>}

      <h3 className="text-xl font-semibold text-gray-800 mt-8">Active Camera Streams</h3>
      {cameras.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {cameras.map((camera) => (
            <li key={camera.id} className="bg-gray-50 p-3 rounded-md shadow-sm flex justify-between items-center">
              <span>Camera ID: {camera.id} (URL: {camera.url})</span>
              <button
                onClick={() => handleRemoveCamera(camera.id)}
                className="ml-4 px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-gray-600">No camera streams added yet.</p>
      )}
    </div>
  );
}

export default AddCameraForm;
