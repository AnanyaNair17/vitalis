import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok || !data.token) {
        setError(data.error || 'Login failed. Please check your credentials.')
        setLoading(false)
        return
      }

      // Store JWT token
      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.role)

      // Redirect according to user role
      if (data.role === 'DONOR') {
        navigate('/donor-availability')
      } else if (data.role === 'HOSPITAL') {
        navigate('/create-request')
      } else if (data.role === 'ADMIN') {
        navigate('/admin-verification')
      } else {
        setError('Unknown user role')
      }

    } catch (err) {
      setError('Unable to connect to server. Please try again.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center px-6">

      <div className="bg-white w-full max-w-md p-10 rounded-3xl shadow-lg">

        <Link to="/" className="text-3xl font-bold text-[#800020]">
          Vitalis.
        </Link>

        <h2 className="text-3xl font-bold text-[#4A1428] mt-8">
          Welcome Back!
        </h2>

        <p className="text-gray-500 mt-2">
          Login to your Vitalis account.
        </p>

        <form onSubmit={handleLogin} className="mt-8">

          <label className="block text-sm font-semibold mb-2">
            Email Address
          </label>

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-5 outline-none focus:border-[#800020]"
          />

          <label className="block text-sm font-semibold mb-2">
            Password
          </label>

          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#800020]"
          />

          {error && (
            <p className="text-red-600 text-sm mt-4">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#800020] text-white py-3 rounded-lg mt-7 font-semibold hover:bg-[#4A1428] transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

        </form>

        <p className="text-center text-sm text-gray-600 mt-7">
          New to Vitalis?{' '}
          <Link
            to="/donor-register"
            className="text-[#800020] font-semibold"
          >
            Register as Donor
          </Link>
        </p>

        <Link
          to="/"
          className="block text-center text-sm text-gray-500 mt-5"
        >
          Back to Home
        </Link>

      </div>
    </div>
  )
}

export default Login
