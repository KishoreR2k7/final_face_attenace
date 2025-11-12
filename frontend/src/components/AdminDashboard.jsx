import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import StudentsManagement from './StudentsManagement'
import CamerasManagement from './CamerasManagement'
import LiveMonitoring from './LiveMonitoring'
import AttendanceManagement from './AttendanceManagement'
import './AdminDashboard.css'

function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState({
    total_students: 0,
    active_cameras: 0,
    present_today: 0,
    attendance_rate: 0
  })

  useEffect(() => {
    // Fetch dashboard stats
    fetchStats()
  }, [])

  const fetchStats = async () => {
    // TODO: Implement API call to fetch stats
    // For now using mock data
    setStats({
      total_students: 45,
      active_cameras: 3,
      present_today: 38,
      attendance_rate: 84.4
    })
  }

  const handleLogout = () => {
    navigate('/')
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard()
      case 'students':
        return <StudentsManagement />
      case 'cameras':
        return <CamerasManagement />
      case 'live':
        return <LiveMonitoring />
      case 'attendance':
        return <AttendanceManagement />
      default:
        return renderDashboard()
    }
  }

  const renderDashboard = () => (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
        <p className="page-subtitle">Monitor attendance and system statistics</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{stats.total_students}</div>
          <div className="stat-label">Total Students</div>
        </div>
        <div className="stat-card stat-success">
          <div className="stat-icon">✓</div>
          <div className="stat-value">{stats.present_today}</div>
          <div className="stat-label">Present Today</div>
        </div>
        <div className="stat-card stat-info">
          <div className="stat-icon">📹</div>
          <div className="stat-value">{stats.active_cameras}</div>
          <div className="stat-label">Active Cameras</div>
        </div>
        <div className="stat-card stat-primary">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{stats.attendance_rate}%</div>
          <div className="stat-label">Attendance Rate</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button
            className="btn btn-primary"
            onClick={() => setActiveTab('students')}
          >
            👥 Manage Students
          </button>
          <button
            className="btn btn-success"
            onClick={() => setActiveTab('cameras')}
          >
            📹 Manage Cameras
          </button>
          <button
            className="btn btn-info"
            onClick={() => setActiveTab('live')}
          >
            📡 Live Recognition
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setActiveTab('attendance')}
          >
            📝 View Attendance
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="admin-dashboard">
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">🎓 Admin Portal</div>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </nav>

      <div className="admin-container">
        <div className="sidebar">
          <div className="sidebar-menu">
            <button
              className={`sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              🏠 Dashboard
            </button>
            <button
              className={`sidebar-item ${activeTab === 'students' ? 'active' : ''}`}
              onClick={() => setActiveTab('students')}
            >
              👥 Students
            </button>
            <button
              className={`sidebar-item ${activeTab === 'cameras' ? 'active' : ''}`}
              onClick={() => setActiveTab('cameras')}
            >
              📹 Cameras
            </button>
            <button
              className={`sidebar-item ${activeTab === 'live' ? 'active' : ''}`}
              onClick={() => setActiveTab('live')}
            >
              📡 Live Recognition
            </button>
            <button
              className={`sidebar-item ${activeTab === 'attendance' ? 'active' : ''}`}
              onClick={() => setActiveTab('attendance')}
            >
              📝 Attendance
            </button>
          </div>
        </div>

        <div className="main-content">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
