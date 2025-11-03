import React, { useState } from 'react'
import Login from '../components/Login'
import AdminDashboard from '../components/AdminDashboard'
import StudentDashboard from '../components/StudentDashboard'
import { loginAdmin } from '../api'

const ADMIN_PASSWORD_HARDCODED = "adminpass"; // Matches backend hardcoded password

function HomePage() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [studentRollNumber, setStudentRollNumber] = useState(null);
  const [error, setError] = useState(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showStudentLogin, setShowStudentLogin] = useState(false);

  const handleAdminLogin = async (username, password) => {
    setError(null);
    try {
      // For a real app, this would be a proper authentication check.
      // For now, we are using hardcoded values as per the backend spec.
      if (username === "admin" && password === ADMIN_PASSWORD_HARDCODED) {
        const response = await loginAdmin(username, password);
        if (response.access_token) {
          setIsAdminLoggedIn(true);
          setShowAdminLogin(false);
        } else {
          setError("Invalid admin credentials.");
        }
      } else {
        setError("Invalid admin credentials.");
      }
    } catch (err) {
      setError(err.message || "Admin login failed.");
    }
  };

  const handleStudentLogin = (rollNumber) => {
    // In a real application, you'd validate the roll number against the DB
    // For this prototype, we'll just set the roll number.
    setStudentRollNumber(rollNumber);
    setShowStudentLogin(false);
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setStudentRollNumber(null);
    setError(null);
    setShowAdminLogin(false);
    setShowStudentLogin(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        {!isAdminLoggedIn && !studentRollNumber && (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome to Face Attendance</h1>
            <div className="space-x-4">
              <button
                onClick={() => { setShowAdminLogin(true); setShowStudentLogin(false); setError(null); }}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Admin Login
              </button>
              <button
                onClick={() => { setShowStudentLogin(true); setShowAdminLogin(false); setError(null); }}
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Student Portal
              </button>
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        )}

        {showAdminLogin && (
          <Login role="admin" onLogin={handleAdminLogin} onCancel={handleLogout} />
        )}

        {showStudentLogin && (
          <Login role="student" onLogin={handleStudentLogin} onCancel={handleLogout} />
        )}

        {isAdminLoggedIn && (
          <AdminDashboard onLogout={handleLogout} />
        )}

        {studentRollNumber && (
          <StudentDashboard rollNumber={studentRollNumber} onLogout={handleLogout} />
        )}
      </div>
    </div>
  );
}

export default HomePage;
