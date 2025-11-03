import React, { useState, useEffect } from 'react';
import { addStudent, getAllStudents } from '../api';

function AddStudentForm() {
  const [studentName, setStudentName] = useState('');
  const [studentImages, setStudentImages] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const fetchedStudents = await getAllStudents();
      setStudents(fetchedStudents);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Failed to load students.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!studentName || studentImages.length === 0) {
      setError("Please provide both student name and at least one image.");
      return;
    }

    try {
      for (const image of studentImages) {
        await addStudent(studentName, image);
      }
      setMessage(`Successfully added student ${studentName}`);
      setStudentName('');
      setStudentImages([]);
      // Reset file input
      document.getElementById('studentImage').value = null;
      fetchStudents(); // Refresh the list of students
    } catch (err) {
      console.error("Error adding student:", err);
      const errorMessage = err.message || "Failed to add student.";
      setError(errorMessage);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setStudentImages(Array.from(e.target.files));
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">Add New Student</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="studentName" className="block text-sm font-medium text-gray-700">Student Name</label>
          <input
            type="text"
            id="studentName"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="studentImage" className="block text-sm font-medium text-gray-700">Student Image</label>
          <input
            type="file"
            id="studentImage"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required
            multiple
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add Student
        </button>
      </form>

      {message && <p className="mt-4 text-green-600 text-center">{message}</p>}
      {error && <p className="mt-4 text-red-600 text-center">Error: {typeof error === 'object' ? JSON.stringify(error) : error}</p>}

      <h3 className="text-xl font-semibold text-gray-800 mt-8">Registered Students</h3>
      {students.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {students.map((student) => (
            <li key={student.id} className="bg-gray-50 p-3 rounded-md shadow-sm flex justify-between items-center">
              <span>{student.name} (ID: {student.id})</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-gray-600">No students registered yet.</p>
      )}
    </div>
  );
}

export default AddStudentForm;
