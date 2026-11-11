
import { useEffect, useState } from 'react'
import API from '../api/axios'

function AdminVerification() {
  const [activeTab, setActiveTab] = useState('donors')
  const [donors, setDonors] = useState([])
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchRegistrations = async () => {
    setLoading(true)
    setError('')

    try {
      const [donorRes, hospitalRes] = await Promise.all([
        API.get('/admin/donors?status=UNVERIFIED'),
        API.get('/admin/hospitals?status=UNVERIFIED'),
      ])

      setDonors(donorRes.data)
      setHospitals(hospitalRes.data)
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Unable to load registrations. Please check your admin login.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRegistrations()
  }, [])

  const handleDecision = async (type, id, decision) => {
    try {
      await API.patch(`/admin/${type}/${id}/verify`, { decision })

      alert(`${type === 'donors' ? 'Donor' : 'Hospital'} ${decision.toLowerCase()} successfully!`)

      fetchRegistrations()
    } catch (err) {
      alert(err.response?.data?.error || 'Unable to update verification status.')
    }
  }

  const registrations = activeTab === 'donors' ? donors : hospitals

  return (
    <div className="min-h-screen bg-[#FFF9F5] p-6 md:p-12">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold text-[#800020]">
          Admin Verification
        </h1>

        <p className="text-gray-600 mt-2 mb-8">
          Review and verify donor and hospital registrations.
        </p>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">

          <button
            onClick={() => setActiveTab('donors')}
            className={`px-6 py-3 rounded-lg font-semibold ${
              activeTab === 'donors'
                ? 'bg-[#800020] text-white'
                : 'bg-white text-[#800020] border'
            }`}
          >
            Donors ({donors.length})
          </button>

          <button
            onClick={() => setActiveTab('hospitals')}
            className={`px-6 py-3 rounded-lg font-semibold ${
              activeTab === 'hospitals'
                ? 'bg-[#800020] text-white'
                : 'bg-white text-[#800020] border'
            }`}
          >
            Hospitals ({hospitals.length})
          </button>

        </div>

        {loading ? (
          <p className="text-gray-600">Loading registrations...</p>
        ) : error ? (
          <div className="bg-white rounded-xl p-6 text-red-600">
            {error}
          </div>
        ) : registrations.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center shadow-sm">
            <p className="text-xl font-semibold text-[#800020]">
              No Pending Registrations
            </p>
            <p className="text-gray-500 mt-2">
              All registrations in this category have been reviewed.
            </p>
          </div>
        ) : (

          <div className="grid md:grid-cols-2 gap-6">

            {registrations.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-7 shadow-sm border border-[#F0E3E5]"
              >

                <h2 className="text-xl font-bold text-[#800020]">
                  {item.name}
                </h2>

                <p className="text-gray-600 mt-3">
                  Email: {item.user?.email || 'Not available'}
                </p>

                <p className="text-gray-600 mt-2">
                  City: {item.city}
                </p>

                {activeTab === 'donors' ? (
                  <>
                    <p className="text-gray-600 mt-2">
                      Blood Group: {item.bloodGroup?.replace('_POS', '+').replace('_NEG', '-')}
                    </p>

                    <p className="text-gray-600 mt-2">
                      Phone: {item.phone}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-600 mt-2">
                    Contact: {item.contact}
                  </p>
                )}

                <p className="text-yellow-700 font-medium mt-4">
                  Status: Pending Verification
                </p>

                <div className="flex gap-3 mt-6">

                  <button
                    onClick={() => handleDecision(activeTab, item.id, 'VERIFIED')}
                    className="flex-1 bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleDecision(activeTab, item.id, 'REJECTED')}
                    className="flex-1 bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700"
                  >
                    Reject
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

        <button
          onClick={fetchRegistrations}
          className="mt-8 border border-[#800020] text-[#800020] px-6 py-2.5 rounded-lg hover:bg-[#800020] hover:text-white"
        >
          Refresh Registrations
        </button>

      </div>
    </div>
  )
}

export default AdminVerification
