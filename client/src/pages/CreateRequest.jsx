import { useState } from 'react'
import API from '../api/axios'

function CreateRequest() {
  const [bloodGroup, setBloodGroup] = useState('')
  const [city, setCity] = useState('')
  const [urgent, setUrgent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

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
        urgent,
      })

      setMessage('Blood request created successfully!')
      console.log('Created request:', response.data)

    } catch (err) {
      console.error('Request creation failed:', err)

      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Hospital login or verification is required to create a request.')
      } else {
        setError(
          err.response?.data?.message ||
          'Unable to create the request. Please try again.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center px-5 py-12">
      <div className="bg-white w-full max-w-xl p-8 md:p-10 rounded-2xl shadow-lg">

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
            <label className="block font-medium mb-2">City</label>

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
    </div>
  )
}

export default CreateRequest