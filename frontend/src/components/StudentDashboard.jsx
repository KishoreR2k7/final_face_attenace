import React, { useState, useEffect } from 'react';
import { getAttendanceRecords } from '../api';

function StudentDashboard({ rollNumber, onLogout }) {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        setError(null);
        // In a real app, you would fetch attendance for a specific rollNumber/student_id
        // For now, fetching all records as the backend only has a general endpoint.
        const records = await getAttendanceRecords();
        // Filter for the current student if rollNumber is available (mock filtering)
        const studentRecords = records.filter(record => record.student_name === `Student ${rollNumber}`);
        setAttendance(studentRecords);
      } catch (err) {
        setError(err.message || "Failed to fetch attendance records.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [rollNumber]);

  return (
    <div className="mt-8 px-8 py-6 bg-white shadow-lg sm:rounded-lg w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Welcome, Student {rollNumber}</h2>
      <div className="flex justify-end mb-4">
        <button
          onClick={onLogout}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Logout
        </button>
      </div>

      {loading && <p className="text-center text-gray-600">Loading attendance...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Attendance History</h3>
          {attendance.length > 0 ? (
            <ul className="space-y-2">
              {attendance.map((record) => (
                <li key={record.id} className="bg-gray-50 p-3 rounded-md shadow-sm flex justify-between items-center">
                  <span>Date: {new Date(record.timestamp).toLocaleDateString()}</span>
                  <span className="text-green-600 font-semibold">Present</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No attendance records found for your roll number.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;
