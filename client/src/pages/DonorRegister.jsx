import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'

function DonorRegister() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    bloodGroup: '',
    city: '',
    phone: '',
    declarationAccepted: false,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await API.post('/auth/register/donor', form)

      if (res.data.token) {
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('role', 'DONOR')
      }

      setSuccess(true)
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Registration failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md text-center">

          <div className="text-5xl mb-5 text-green-600">&#10003;</div>

          <h1 className="text-2xl font-bold text-[#800020]">
            Registration Successful!
          </h1>

          <p className="text-gray-600 mt-4">
            Thank you for registering as a blood donor.
            Your profile is now waiting for admin verification.
          </p>

          <button
            onClick={() => navigate('/')}
            className="mt-7 bg-[#800020] text-white px-6 py-3 rounded-lg"
          >
            Back to Home
          </button>

        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] px-6 py-12">

      <div className="max-w-2xl mx-auto">

        <h1 className="text-3xl font-bold text-[#800020] text-center">
          Become a Blood Donor
        </h1>

        <p className="text-gray-500 text-center mt-3 mb-8">
          Your one registration could help save someone's life.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border p-8 space-y-5"
        >

          <div>
            <label className="block font-semibold mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              minLength={8}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              pattern="[0-9]{10}"
              maxLength={10}
              required
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Blood Group
            </label>

            <select
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3"
            >
              <option value="">Select your blood group</option>
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
            <label className="block font-semibold mb-2">
              City
            </label>

            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Enter your city"
              required
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              name="declarationAccepted"
              checked={form.declarationAccepted}
              onChange={handleChange}
              required
              className="mt-1"
            />

            <label className="text-sm text-gray-600">
              I confirm that the information provided is accurate
              and I consent to being contacted regarding blood donation.
            </label>
          </div>

          {error && (
            <p className="text-red-600 text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#800020] hover:bg-[#600018] text-white font-semibold py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register as Donor'}
          </button>

        </form>

      </div>
    </div>
  )
}

export default DonorRegister
