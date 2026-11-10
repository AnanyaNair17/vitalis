import { useState } from 'react'

function DonorAvailability() {
  const [available, setAvailable] = useState(true)

  const toggleAvailability = () => {
    setAvailable(!available)
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center px-5">

      <div className="bg-white w-full max-w-lg p-10 rounded-2xl shadow-lg text-center">

        <h1 className="text-3xl font-bold text-[#800020]">
          Donor Availability
        </h1>

        <p className="text-gray-500 mt-3">
          Manage your availability to help people in need.
        </p>

        <div className="my-10">

          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-4xl ${
            available ? 'bg-green-100' : 'bg-gray-100'
          }`}>
            {available ? '❤️' : '🤍'}
          </div>

          <h2 className={`text-2xl font-bold mt-5 ${
            available ? 'text-green-600' : 'text-gray-500'
          }`}>
            {available ? 'You are Available' : 'You are Unavailable'}
          </h2>

          <p className="text-gray-500 mt-2">
            {available
              ? 'Hospitals can find you as a potential donor.'
              : 'You will not appear in donor matching results.'}
          </p>

        </div>

        <button
          onClick={toggleAvailability}
          className={`w-full py-3 rounded-lg text-white font-semibold transition ${
            available
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {available ? 'Mark as Unavailable' : 'Mark as Available'}
        </button>

      </div>
    </div>
  )
}

export default DonorAvailability