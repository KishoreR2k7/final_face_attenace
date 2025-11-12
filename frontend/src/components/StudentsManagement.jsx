import React, { useState, useEffect } from 'react'
import { getAllStudents } from '../api'
import './StudentsManagement.css'

function StudentsManagement() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    images: []
  })

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await getAllStudents()
      setStudents(response)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching students:', err)
      setLoading(false)
    }
  }

  const handleAddStudent = () => {
    setSelectedStudent(null)
    setFormData({ name: '', images: [] })
    setShowModal(true)
  }

  const handleEditStudent = (student) => {
    setSelectedStudent(student)
    setFormData({ name: student.name, images: [] })
    setShowModal(true)
  }

  const handleDeleteStudent = async (studentId, studentName) => {
    if (!window.confirm(`Are you sure you want to delete ${studentName}?`)) {
      return
    }
    
    try {
      const { deleteStudent } = await import('../api')
      await deleteStudent(studentId)
      alert(`Student ${studentName} deleted successfully`)
      fetchStudents()
    } catch (err) {
      console.error('Error deleting student:', err)
      alert('Failed to delete student: ' + err.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // This will be handled by AddStudentForm component
    setShowModal(false)
    fetchStudents()
  }

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div className="loading">Loading students...</div>
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Students Management</h1>
        <p className="page-subtitle">Add, edit, and manage student records</p>
      </div>

      <div className="card-actions">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search students by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleAddStudent}>
          ➕ Add Student
        </button>
      </div>

      {filteredStudents.length > 0 ? (
        <div className="students-grid">
          {filteredStudents.map((student) => (
            <div key={student.name} className="student-card">
              <div className="student-card-header">
                <div className="student-avatar">
                  {student.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3>{student.name}</h3>
                  <p className="student-id">ID: {student.name}</p>
                </div>
              </div>
              <div className="student-card-body">
                <p><strong>� Roll No:</strong> {student.roll_number || 'N/A'}</p>
                <p><strong>📧 Email:</strong> {student.email || 'N/A'}</p>
                <p><strong>� Photo:</strong> {student.photo_path ? 'Uploaded' : 'No photo'}</p>
              </div>
              <div className="student-card-actions">
                <button 
                  className="btn btn-sm btn-secondary"
                  onClick={() => handleEditStudent(student)}
                >
                  ✏️ Edit
                </button>
                <button 
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteStudent(student.id, student.name)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <p className="no-data">
            {searchTerm ? 'No students found matching your search.' : 'No students added yet. Click "Add Student" to get started.'}
          </p>
        </div>
      )}

      {showModal && (
        <AddStudentModal
          student={selectedStudent}
          onClose={() => {
            setShowModal(false)
            fetchStudents()
          }}
        />
      )}
    </div>
  )
}

// Add Student Modal Component
function AddStudentModal({ student, onClose }) {
  const [name, setName] = useState(student?.name || '')
  const [rollNumber, setRollNumber] = useState(student?.roll_number || '')
  const [email, setEmail] = useState(student?.email || '')
  const [selectedImages, setSelectedImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleImageSelect = (e) => {
    if (e.target.files) {
      setSelectedImages(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!name.trim()) {
      setError('Please enter a student name')
      return
    }

    if (!rollNumber.trim()) {
      setError('Please enter a roll number')
      return
    }

    if (selectedImages.length === 0) {
      setError('Please select at least one image')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Import the API function
      const { addStudent } = await import('../api')
      
      await addStudent(name, rollNumber, email, selectedImages)

      alert(`Successfully added student ${name} with ${selectedImages.length} photo(s)`)
      onClose()
    } catch (err) {
      console.error('Error adding student:', err)
      setError(err.message || 'Failed to add student')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{student ? 'Edit Student' : 'Add New Student'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Student Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter student full name"
                required
              />
            </div>

            <div className="form-group">
              <label>Roll Number *</label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="Enter roll number"
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com (optional)"
              />
            </div>

            <div className="form-group">
              <label>Upload Photos *</label>
              <p className="help-text">Upload multiple clear photos showing the student's face (improves recognition accuracy)</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                multiple
                required
              />
              {selectedImages.length > 0 && (
                <p className="text-success">✓ {selectedImages.length} photo(s) selected</p>
              )}
            </div>

            {error && (
              <div className="alert alert-danger">{error}</div>
            )}
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : student ? 'Update' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StudentsManagement
