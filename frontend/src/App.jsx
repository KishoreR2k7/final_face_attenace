import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import HomePage from './pages/HomePage'
import './index.css'

function App() {

  return (
    <Router>
      <nav className="p-4 bg-gray-800 text-white flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Face Attendance System</Link>
        <div>
          {/* You can add navigation links here for different sections if needed */}
        </div>
      </nav>

      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Add other routes here as you create more pages/components */}
        </Routes>
      </div>
    </Router>
  )
}

export default App
