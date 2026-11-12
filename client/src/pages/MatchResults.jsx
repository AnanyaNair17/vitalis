import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import API from '../api/axios'

function MatchResults() {
  const [searchParams] = useSearchParams()

  const [requests, setRequests] = useState([])
  const [selectedRequest, setSelectedRequest] = useState('')
  const [donors, setDonors] = useState([])
  const [loading, setLoading] = useState(true)
  const [matchLoading, setMatchLoading] = useState(false)
  const [error, setError] = useState('')
  const [requestDetails, setRequestDetails] = useState(null)

  const bloodGroupNames = {
    A_POS: 'A Positive (A+)',
    A_NEG: 'A Negative (A-)',
    B_POS: 'B Positive (B+)',
    B_NEG: 'B Negative (B-)',
    AB_POS: 'AB Positive (AB+)',
    AB_NEG: 'AB Negative (AB-)',
    O_POS: 'O Positive (O+)',
    O_NEG: 'O Negative (O-)'
  }

  // Fetch all hospital requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await API.get('/requests')
        const requestList = res.data.requests || []

        setRequests(requestList)

        const requestedId = searchParams.get('requestId')

        const requestedExists = requestList.some(
          request => String(request.id) === requestedId
        )

        if (requestedExists) {
          setSelectedRequest(requestedId)
        } else if (requestList.length > 0) {
          setSelectedRequest(String(requestList[0].id))
        }
      } catch (err) {
        console.error(err)
        setError(
          err.response?.data?.error ||
          'Unable to fetch blood requests. Please log in as a hospital.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [searchParams])

  // Fetch matches whenever selected request changes
  useEffect(() => {
    if (!selectedRequest) return

    const fetchMatches = async () => {
      try {
        setMatchLoading(true)
        setError('')
        setDonors([])
        setRequestDetails(null)

        const res = await API.get(
          `/requests/${selectedRequest}/matches`
        )

        setDonors(res.data.donors || [])
        setRequestDetails(res.data)
      } catch (err) {
        console.error(err)
        setError(
          err.response?.data?.error ||
          'Unable to fetch matching donors.'
        )
      } finally {
        setMatchLoading(false)
      }
    }

    fetchMatches()
  }, [selectedRequest])

  return (
    <div className="min-h-screen bg-[#FFF9F5] px-6 py-12 text-[#292124]">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold text-[#800020]">
          Compatible Donors
        </h1>

        <p className="text-gray-500 mt-2">
          Donors ranked based on blood compatibility and location.
        </p>

        {loading && (
          <p className="mt-8 text-gray-600">
            Loading your blood requests...
          </p>
        )}

        {!loading && requests.length === 0 && !error && (
          <div className="bg-white rounded-xl p-8 mt-8 shadow-sm">
            <h2 className="text-xl font-bold">
              No Blood Requests Found
            </h2>
            <p className="text-gray-500 mt-2">
              Create a blood request first to find compatible donors.
            </p>
          </div>
        )}

        {!loading && requests.length > 0 && (
          <>
            <div className="bg-white rounded-xl p-6 mt-8 shadow-sm border border-[#F0E3E5]">

              <label className="block font-semibold mb-3">
                Select Blood Request
              </label>

              <select
                value={selectedRequest}
                onChange={(e) => setSelectedRequest(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#800020]"
              >
                {requests.map((request) => (
                  <option key={request.id} value={request.id}>
                    Request #{request.id} - {bloodGroupNames[request.bloodGroup] || request.bloodGroup} - {request.city}
                  </option>
                ))}
              </select>

            </div>

            {requestDetails && (
              <div className="bg-white rounded-xl p-6 mt-6 shadow-sm border border-[#F0E3E5]">

                <p className="text-gray-500 text-sm">
                  Request #{selectedRequest}
                </p>

                <h2 className="text-2xl font-bold text-[#800020] mt-2">
                  {bloodGroupNames[requestDetails.bloodGroup] || requestDetails.bloodGroup}
                </h2>

                <p className="text-sm text-gray-500 mt-2">
                  Location: {requestDetails.city}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Total Compatible Donors: {requestDetails.totalMatches}
                </p>

              </div>
            )}

            <h2 className="text-xl font-bold text-[#4A1428] mt-10 mb-5">
              Top Matching Donors
            </h2>

            {matchLoading && (
              <p className="text-gray-600">
                Finding compatible donors...
              </p>
            )}

            {!matchLoading && !error && selectedRequest && donors.length === 0 && (
              <div className="bg-white rounded-xl p-8 shadow-sm text-center">
                <h3 className="text-lg font-bold">
                  No Compatible Donors Found
                </h3>
                <p className="text-gray-500 mt-2">
                  No verified and available donors currently match this request.
                </p>
              </div>
            )}

            {!matchLoading && donors.length > 0 && (
              <div className="space-y-4">

                {donors.map((donor, index) => (
                  <div
                    key={donor.id}
                    className="bg-white rounded-xl p-6 shadow-sm border border-[#F0E3E5] flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >

                    <div className="flex items-center gap-4">

                      <div className="w-12 h-12 rounded-full bg-[#F4DDE1] flex items-center justify-center text-[#800020] font-bold text-xl">
                        {donor.name?.charAt(0) || 'D'}
                      </div>

                      <div>
                        <h3 className="font-bold text-lg text-[#4A1428]">
                          {donor.name || 'Donor'}
                        </h3>

                        <p className="text-sm text-gray-500">
                          {donor.city}
                        </p>

                        <p className="text-sm text-gray-400">
                          Match Rank: #{index + 1}
                        </p>
                      </div>

                    </div>

                    <div className="flex items-center gap-5">

                      <span className="bg-[#F4DDE1] text-[#800020] px-4 py-2 rounded-lg font-bold">
                        {bloodGroupNames[donor.bloodGroup] || donor.bloodGroup}
                      </span>

                      {donor.phone ? (
                        <a
                          href={`tel:${donor.phone}`}
                          className="text-green-700 font-semibold text-sm underline"
                        >
                          Call: {donor.phone}
                        </a>
                      ) : (
                        <span className="text-gray-500 text-xs">
                          Contact hidden until acceptance
                        </span>
                      )}

                      <span className="text-green-600 font-semibold text-sm">&#10003; Verified & Available</span>

                    </div>

                  </div>
                ))}

              </div>
            )}
          </>
        )}

        {error && (
          <div className="mt-6 bg-red-100 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        )}

      </div>
    </div>
  )
}

export default MatchResults

