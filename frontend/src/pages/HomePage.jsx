import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './HomePage.css'

function HomePage() {
  const [studentRoll, setStudentRoll] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const navigate = useNavigate()

  const handleStudentLogin = (e) => {
    e.preventDefault()
    if (studentRoll.trim()) {
      navigate(`/student/${studentRoll.trim()}`)
    }
  }

  const handleAdminLogin = (e) => {
    e.preventDefault()
    // Simple password check - in production, use proper authentication
    if (adminPassword === 'admin123') {
      navigate('/admin')
    } else {
      alert('Invalid admin password')
    }
  }

  return (
    <div className="home-page">
      <div className="home-container">
        <div className="home-header">
          <h1>🎓 Face Recognition Attendance System</h1>
          <p>Real-time attendance tracking with AI-powered face recognition</p>
        </div>

        <div className="login-cards">
          <div className="card login-card">
            <h2>Student Portal</h2>
            <p>View your attendance and statistics</p>
            <form onSubmit={handleStudentLogin}>
              <div className="form-group">
                <label>Roll Number</label>
                <input
                  type="text"
                  placeholder="Enter your roll number"
                  value={studentRoll}
                  onChange={(e) => setStudentRoll(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                Student Login
              </button>
            </form>
          </div>

          <div className="card login-card">
            <h2>Admin Portal</h2>
            <p>Manage students, cameras, and attendance</p>
            <form onSubmit={handleAdminLogin}>
              <div className="form-group">
                <label>Admin Password</label>
                <input
                  type="password"
                  placeholder="Enter admin password (admin123)"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-success btn-block">
                Admin Login
              </button>
            </form>
          </div>
        </div>

        <div className="features">
          <div className="feature-card">
            <div className="feature-icon">📹</div>
            <h3>Live Monitoring</h3>
            <p>Real-time face detection and recognition with GPU acceleration</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Attendance Tracking</h3>
            <p>Automated attendance marking with confidence scores</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>High Accuracy</h3>
            <p>InsightFace-powered recognition with 99%+ accuracy</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
