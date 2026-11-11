
import { useState } from 'react'
import API from '../api/axios'

function DonorAvailability() {
  const [available, setAvailable] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const updateAvailability = async () => {
    setLoading(true)
    setMessage('')

    try {
      const res = await API.patch('/donor/availability', {
        available: !available,
      })

      setAvailable(res.data.available)
      setMessage(
        res.data.available
          ? 'You are now available for blood donation!'
          : 'Your availability has been turned off.'
      )
    } catch (err) {
      setMessage(
        err.response?.data?.error ||
        'Unable to update availability. Please login as a donor.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center p-6">

      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-lg w-full text-center">

        <div className="text-6xl text-[#800020] mb-5">
          ♥
        </div>

        <h1 className="text-3xl font-bold text-[#800020]">
          Donor Availability
        </h1>

        <p className="text-gray-600 mt-4">
          Let hospitals know whether you are currently available
          to donate blood.
        </p>

        <div className="mt-8 p-5 rounded-xl bg-[#FFF9F5]">

          <p className="text-gray-600 font-medium">
            Current Status
          </p>

          <p className={`text-xl font-bold mt-2 ${
            available ? 'text-green-600' : 'text-red-600'
          }`}>
            {available ? 'Available' : 'Not Available'}
          </p>

        </div>

        <button
          onClick={updateAvailability}
          disabled={loading}
          className="mt-7 w-full bg-[#800020] text-white py-3 rounded-lg font-semibold hover:bg-[#4A1428] disabled:opacity-50"
        >
          {loading
            ? 'Updating...'
            : available
              ? 'Turn Availability OFF'
              : 'Turn Availability ON'}
        </button>

        {message && (
          <p className="mt-5 text-sm text-gray-700">
            {message}
          </p>
        )}

      </div>

    </div>
  )
}

export default DonorAvailability
