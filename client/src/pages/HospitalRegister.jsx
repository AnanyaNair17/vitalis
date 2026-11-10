import { useState } from 'react'
import API from '../api/axios'

function HospitalRegister() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [contact, setContact] = useState('')
  const [city, setCity] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    setMessage('')
    setError('')

    if (!name.trim() || !email.trim() || !contact.trim() || !city.trim() || !password) {
      setError('Please fill in all the fields.')
      return
    }

    if (!/^\d{10}$/.test(contact)) {
      setError('Please enter a valid 10-digit phone number.')
      return
    }

    try {
      setLoading(true)

      const response = await API.post('/auth/register/hospital', {
        name: name.trim(),
        email: email.trim(),
        password,
        city: city.trim(),
        contact: contact.trim(),
      })

      setMessage(
        response.data.message || 'Registration successful! Awaiting admin verification.'
      )

      setName('')
      setEmail('')
      setContact('')
      setCity('')
      setPassword('')

    } catch (err) {
      console.error('Hospital registration failed:', err)

      setError(
        err.response?.data?.message ||
        'Registration failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center px-5 py-12">
      <div className="bg-white w-full max-w-xl p-8 md:p-10 rounded-2xl shadow-lg">

        <h1 className="text-3xl font-bold text-[#800020] text-center">
          Hospital Registration
        </h1>

        <p className="text-gray-500 text-center mt-2 mb-8">
          Register your hospital with Vitalis
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block font-medium mb-2">Hospital Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter hospital name"
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#800020]"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter official email"
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#800020]"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Phone Number</label>
            <input
              type="tel"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Enter 10-digit contact number"
              maxLength="10"
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#800020]"
              required
            />
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

          <div>
            <label className="block font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#800020]"
              required
            />
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
            {loading ? 'Registering...' : 'Register Hospital'}
          </button>

        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already registered?{' '}
          <span className="text-[#800020] font-semibold">
            Login
          </span>
        </p>

      </div>
    </div>
  )
}

export default HospitalRegister