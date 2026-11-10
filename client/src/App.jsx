import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import HospitalRegister from './pages/HospitalRegister'
import CreateRequest from './pages/CreateRequest'
import MatchResults from './pages/MatchResults'
import DonorAvailability from './components/DonorAvailability'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/hospital-register" element={<HospitalRegister />} />
      <Route path="/create-request" element={<CreateRequest />} />
      <Route path="/matches" element={<MatchResults />} />
      <Route path="/donor-availability" element={<DonorAvailability />} />
    </Routes>
  )
}

export default App