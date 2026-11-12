import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'

import Home from './pages/Home'
import HospitalRegister from './pages/HospitalRegister'
import CreateRequest from './pages/CreateRequest'
import MatchResults from './pages/MatchResults'
import DonorAvailability from './pages/DonorAvailability'
import DonorRegister from './pages/DonorRegister'
import AdminVerification from './pages/AdminVerification'
import Login from './pages/Login'
import DonorNotifications from './pages/DonorNotifications'

function ProtectedRoute({ allowedRole, children }) {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (role !== allowedRole) {
    const destinations = {
      DONOR: '/donor-availability',
      HOSPITAL: '/create-request',
      ADMIN: '/admin-verification',
    }

    return <Navigate to={destinations[role] || '/login'} replace />
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('user')
    navigate('/login', { replace: true })
  }

  return (
    <>
      <button
        onClick={handleLogout}
        className="fixed top-4 right-5 z-50 bg-[#800020] text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-[#4A1428] transition"
      >
        Logout
      </button>
      {children}
    </>
  )
}

function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/donor-register" element={<DonorRegister />} />
      <Route path="/hospital-register" element={<HospitalRegister />} />

      {/* Donor-only pages */}
      <Route
        path="/donor-availability"
        element={<ProtectedRoute allowedRole="DONOR"><DonorAvailability /></ProtectedRoute>}
      />
      <Route
        path="/donor-notifications"
        element={<ProtectedRoute allowedRole="DONOR"><DonorNotifications /></ProtectedRoute>}
      />

      {/* Hospital-only pages */}
      <Route
        path="/create-request"
        element={<ProtectedRoute allowedRole="HOSPITAL"><CreateRequest /></ProtectedRoute>}
      />
      <Route
        path="/matches"
        element={<ProtectedRoute allowedRole="HOSPITAL"><MatchResults /></ProtectedRoute>}
      />

      {/* Admin-only page */}
      <Route
        path="/admin-verification"
        element={<ProtectedRoute allowedRole="ADMIN"><AdminVerification /></ProtectedRoute>}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
