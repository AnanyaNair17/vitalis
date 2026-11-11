
import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import HospitalRegister from './pages/HospitalRegister'
import CreateRequest from './pages/CreateRequest'
import MatchResults from './pages/MatchResults'
import DonorAvailability from './pages/DonorAvailability'
import DonorRegister from './pages/DonorRegister'
import AdminVerification from './pages/AdminVerification'
import Login from './pages/Login'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/hospital-register" element={<HospitalRegister />} />

      <Route path="/create-request" element={<CreateRequest />} />

      <Route path="/matches" element={<MatchResults />} />

      <Route path="/donor-availability" element={<DonorAvailability />} />

      <Route path="/donor-register" element={<DonorRegister />} />

      <Route path="/admin-verification" element={<AdminVerification />} />

      <Route path="/login" element={<Login />} />

    </Routes>
  )
}

export default App
