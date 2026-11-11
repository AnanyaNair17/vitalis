import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios'

function CreateRequest() {
  const [bloodGroup, setBloodGroup] = useState('')
  const [city, setCity] = useState('')
  const [urgent, setUrgent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [requests, setRequests] = useState([])
  const [fetchingRequests, setFetchingRequests] = useState(false)
  const [historyError, setHistoryError] = useState('')

  const loadRequests = async () => {
    try {
      setFetchingRequests(true)
      setHistoryError('')

      const response = await API.get('/requests')
      setRequests(response.data.requests || [])
    } catch (err) {
      console.error('Unable to fetch requests:', err)
      setHistoryError(
        err.response?.data?.error ||
        'Unable to load previous blood requests.'
      )
    } finally {
      setFetchingRequests(false)
    }
  }

  useEffect(() => {
    loadRequests()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    setMessage('')
    setError('')

    if (!bloodGroup || !city.trim()) {
      setError('Please select a blood group and enter a city.')
      return
    }

    try {
      setLoading(true)

      const response = await API.post('/requests', {
        bloodGroup,
        city: city.trim(),
        urgent
      })

      setMessage('Blood request created successfully!')
      console.log('Created request:', response.data)

      setBloodGroup('')
      setCity('')
      setUrgent(false)

      await loadRequests()

    } catch (err) {
      console.error('Request creation failed:', err)

      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Hospital login or verification is required to create a request.')
      } else {
        setError(
          err.response?.data?.error ||
          err.response?.data?.message ||
          'Unable to create the request. Please try again.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  const formatBloodGroup = (group) => {
    const groups = {
      A_POS: 'A+',
      A_NEG: 'A-',
      B_POS: 'B+',
      B_NEG: 'B-',
      AB_POS: 'AB+',
      AB_NEG: 'AB-',
      O_POS: 'O+',
      O_NEG: 'O-'
    }

    return groups[group] || group
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] px-5 py-12">

      <div className="max-w-3xl mx-auto">

        {/* Create Request Form */}
        <div className="bg-white w-full p-8 md:p-10 rounded-2xl shadow-lg">

          <h1 className="text-3xl font-bold text-[#800020] text-center">
            Create Blood Request
          </h1>

          <p className="text-gray-500 text-center mt-2 mb-8">
            Find compatible blood donors through Vitalis
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block font-medium mb-2">
                Required Blood Group
              </label>

              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#800020]"
                required
              >
                <option value="">Select blood group</option>
                <option value="A_POS">A+</option>
                <option value="A_NEG">A-</option>
                <option value="B_POS">B+</option>
                <option value="B_NEG">B-</option>
                <option value="AB_POS">AB+</option>
                <option value="AB_NEG">AB-</option>
                <option value="O_POS">O+</option>
                <option value="O_NEG">O-</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-2">
                City
              </label>

              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city"
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#800020]"
                required
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="urgent"
                checked={urgent}
                onChange={(e) => setUrgent(e.target.checked)}
                className="w-5 h-5 accent-[#800020]"
              />

              <label htmlFor="urgent" className="font-medium">
                Mark this request as Urgent
              </label>
            </div>

            {error && (
              <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                {error}
              </p>
            )}

            {message && (
              <p className="text-green-700 text-sm bg-green-50 p-3 rounded-lg">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#800020] text-white py-3 rounded-lg font-semibold hover:bg-[#4A1428] transition disabled:opacity-60"
            >
              {loading ? 'Submitting...' : 'Submit Blood Request'}
            </button>

          </form>
        </div>

        {/* Previous Blood Requests */}
        <div className="bg-white w-full p-8 md:p-10 rounded-2xl shadow-lg mt-8">

          <div className="flex items-center justify-between gap-4 mb-6">

            <div>
              <h2 className="text-2xl font-bold text-[#800020]">
                My Blood Requests
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                View your previously created requests
              </p>
            </div>

            <button
              onClick={loadRequests}
              disabled={fetchingRequests}
              className="bg-[#800020] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#4A1428] disabled:opacity-60"
            >
              {fetchingRequests ? 'Loading...' : 'Refresh'}
            </button>

          </div>

          {historyError && (
            <p className="text-red-600 bg-red-50 p-3 rounded-lg text-sm">
              {historyError}
            </p>
          )}

          {fetchingRequests ? (
            <p className="text-gray-500 text-center py-6">
              Loading your requests...
            </p>
          ) : requests.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              You haven't created any blood requests yet.
            </p>
          ) : (

            <div className="space-y-4">

              {requests.map((request) => (

                <div
                  key={request.id}
                  className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition"
                >

                  <div className="flex justify-between items-start gap-3">

                    <div>
                      <h3 className="text-lg font-bold text-[#4A1428]">
                        {formatBloodGroup(request.bloodGroup)} Blood Required
                      </h3>

                      <p className="text-gray-600 mt-1">
                        📍 {request.city}
                      </p>

                      <p className="text-sm text-gray-500 mt-2">
                        Request ID: {request.id}
                      </p>
                    </div>

                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      request.status === 'CLOSED'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {request.status || 'OPEN'}
                    </span>

                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">

                    <span className={`text-sm font-semibold ${
                      request.urgent
                        ? 'text-red-600'
                        : 'text-gray-500'
                    }`}>
                      {request.urgent ? '🚨 Urgent Request' : 'Regular Request'}
                    </span>

                    <span className="text-xs text-gray-400">
                      {request.createdAt
                        ? new Date(request.createdAt).toLocaleDateString()
                        : ''}
                    </span>

                  </div>

                  {/* View Matching Donors */}
                  <div className="mt-4">

                    <Link
                      to={`/matches?requestId=${request.id}`}
                      className="inline-block bg-[#800020] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#4A1428] transition"
                    >
                      View Matching Donors →
                    </Link>

                  </div>

                </div>

              ))}

            </div>

          )}

          <p className="text-xs text-gray-400 mt-6 text-center">
            Your previous requests remain available whenever you log in.
          </p>

        </div>

      </div>

    </div>
  )
}

export default CreateRequest