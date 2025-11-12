import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './StudentDashboard.css'

function StudentDashboard() {
  const { rollNumber } = useParams()
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [attendance, setAttendance] = useState([])
  const [todayStatus, setTodayStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStudentData()
  }, [rollNumber])

  const fetchStudentData = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API calls
      // Mock data for demonstration
      setStudent({
        name: 'John Doe',
        roll_number: rollNumber,
        department: 'Computer Science',
        year: '3rd Year',
        section: 'A',
        email: 'john@example.com',
        attendance_percentage: 85.5,
        present_days: 43,
        total_days: 50
      })

      setAttendance([
        { id: 1, date: new Date(), time: new Date(), status: 'Present', camera: 'Main Gate', confidence: 98.5 },
        { id: 2, date: new Date(Date.now() - 86400000), time: new Date(Date.now() - 86400000), status: 'Present', camera: 'Main Gate', confidence: 97.2 },
      ])

      setTodayStatus({ status: 'Present', time: new Date(), confidence: 98.5 })
      setLoading(false)
    } catch (err) {
      console.error('Error fetching student data:', err)
      setError('Student not found or unable to fetch data')
      setLoading(false)
    }
  }

  const handleLogout = () => {
    navigate('/')
  }

  if (loading) {
    return <div className="loading">Loading student data...</div>
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger">{error}</div>
        <button onClick={handleLogout} className="btn btn-secondary">
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="student-dashboard">
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">🎓 Student Portal</div>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </nav>

      <div className="container">
        {/* Student Info Card */}
        <div className="card student-info-card">
          <div className="student-header">
            <div className="student-avatar">
              <div className="avatar-placeholder">
                {student.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="student-details">
              <h1>{student.name}</h1>
              <p>Roll Number: <strong>{student.roll_number}</strong></p>
              <p>{student.department} | {student.year} | Section {student.section}</p>
              <p>Email: {student.email}</p>
            </div>
          </div>
        </div>

        {/* Today's Status */}
        <div className="card">
          <h2>Today's Status</h2>
          <div className="today-status">
            {todayStatus ? (
              <div className="status-present-container">
                <div className="status-icon">✓</div>
                <div>
                  <h3>Present</h3>
                  <p>Marked at {new Date(todayStatus.time).toLocaleTimeString()}</p>
                  <p>Confidence: {todayStatus.confidence}%</p>
                </div>
              </div>
            ) : (
              <div className="status-absent-container">
                <div className="status-icon">✗</div>
                <div>
                  <h3>Absent</h3>
                  <p>Not marked today</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{student.attendance_percentage}%</div>
            <div className="stat-label">Attendance Rate</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{student.present_days}</div>
            <div className="stat-label">Days Present</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{student.total_days}</div>
            <div className="stat-label">Total Days</div>
          </div>
        </div>

        {/* Attendance History */}
        <div className="card">
          <h2>Attendance History</h2>
          {attendance.length > 0 ? (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Camera</th>
                    <th>Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((record) => (
                    <tr key={record.id}>
                      <td>{new Date(record.date).toLocaleDateString()}</td>
                      <td>{new Date(record.time).toLocaleTimeString()}</td>
                      <td>
                        <span className="status-badge status-present">
                          {record.status}
                        </span>
                      </td>
                      <td>{record.camera}</td>
                      <td>{record.confidence}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-data">No attendance records found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
