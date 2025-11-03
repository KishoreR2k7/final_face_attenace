import React, { useState } from 'react';
import AddStudentForm from './AddStudentForm';
import AddCameraForm from './AddCameraForm';
import LiveRecognition from './LiveRecognition';
import AttendanceRecords from './AttendanceRecords';

function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('students');

  const renderContent = () => {
    switch (activeTab) {
      case 'students':
        return <AddStudentForm />;
      case 'cameras':
        return <AddCameraForm />;
      case 'live-recognition':
        return <LiveRecognition />;
      case 'attendance':
        return <AttendanceRecords />;
      default:
        return <AddStudentForm />;
    }
  };

  return (
    <div className="mt-8 bg-white shadow-lg sm:rounded-lg w-full max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Admin Dashboard</h2>
      
      <div className="flex justify-end mb-4">
        <button
          onClick={onLogout}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Logout
        </button>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('students')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'students'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Students
          </button>
          <button
            onClick={() => setActiveTab('cameras')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'cameras'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Cameras
          </button>
          <button
            onClick={() => setActiveTab('live-recognition')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'live-recognition'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Live Recognition
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'attendance'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Attendance
          </button>
        </nav>
      </div>

      <div className="mt-6">
        {renderContent()}
      </div>
    </div>
  );
}

export default AdminDashboard;
