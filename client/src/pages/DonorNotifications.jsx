import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios'

function DonorNotifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [answers, setAnswers] = useState({})

  const questions = [
    { key: 'alcoholLast24Hours', label: 'Have you consumed alcohol in the last 24 hours?' },
    { key: 'recentIllness', label: 'Have you recently experienced an illness or fever?' },
    { key: 'recentTattooOrPiercing', label: 'Have you recently had a tattoo or piercing?' },
    { key: 'donatedRecently', label: 'Have you donated blood recently?' },
  ]

  const loadNotifications = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await API.get('/donor/notifications')
      setNotifications(response.data.notifications || [])
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to load notifications. Please log in as a donor.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  const updateAnswer = (matchId, key, value) => {
    setAnswers(previous => ({
      ...previous,
      [matchId]: {
        ...previous[matchId],
        [key]: value,
      },
    }))
  }

  const submitChecklist = async (matchId) => {
    const selected = answers[matchId]

    if (!selected || questions.some(question => typeof selected[question.key] !== 'boolean')) {
      setError('Please answer all four questions before submitting.')
      return
    }

    try {
      setSubmitting(matchId)
      setError('')
      setMessage('')

      const response = await API.post(`/matches/${matchId}/checklist`, selected)

      setMessage(response.data.message)
      await loadNotifications()
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to submit checklist.')
    } finally {
      setSubmitting(null)
    }
  }

  const statusStyle = {
    NOTIFIED: 'bg-blue-100 text-blue-800',
    ACCEPTED: 'bg-green-100 text-green-800',
    INELIGIBLE: 'bg-red-100 text-red-800',
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] px-5 py-12">
      <div className="max-w-4xl mx-auto">
        <Link to="/donor-availability" className="text-[#800020] font-semibold">
          ← Back to Donor Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-[#800020] mt-6">
          Donation Notifications
        </h1>

        <p className="text-gray-600 mt-2">
          Review blood requests that match your donor profile.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-6 text-sm text-yellow-900">
          <strong>Medical disclaimer:</strong> This checklist is only a preliminary
          project feature. It is not medical screening or clearance. Final donor
          eligibility must be assessed by an authorized hospital or blood bank.
        </div>

        {error && (
          <p className="mt-5 bg-red-50 text-red-700 p-4 rounded-lg">{error}</p>
        )}

        {message && (
          <p className="mt-5 bg-green-50 text-green-700 p-4 rounded-lg">{message}</p>
        )}

        {loading ? (
          <p className="mt-8 text-gray-600">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-xl p-8 mt-8 text-center shadow-sm">
            <h2 className="text-xl font-bold text-[#4A1428]">No Notifications Yet</h2>
            <p className="text-gray-500 mt-2">
              Matching blood requests will appear here when available.
            </p>
          </div>
        ) : (
          <div className="space-y-6 mt-8">
            {notifications.map(notification => (
              <div key={notification.id} className="bg-white rounded-2xl shadow-sm border border-[#F0E3E5] p-6">
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-[#800020]">
                      Blood Request #{notification.request.id}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Required group: {notification.request.bloodGroup.replace('_', ' ')}
                    </p>
                    <p className="text-gray-600">
                      Location: {notification.request.city}
                    </p>
                    <p className="text-gray-600">
                      Hospital: {notification.request.hospital?.name || 'Registered hospital'}
                    </p>
                    {notification.request.urgent && (
                      <p className="text-red-600 font-semibold mt-2">Urgent request</p>
                    )}
                  </div>

                  <span className={`h-fit px-3 py-2 rounded-full text-sm font-semibold ${statusStyle[notification.status] || 'bg-gray-100 text-gray-700'}`}>
                    {notification.status}
                  </span>
                </div>

                {notification.status === 'NOTIFIED' && (
                  <div className="mt-6 border-t pt-5">
                    <h3 className="font-bold text-[#4A1428] text-lg">
                      Preliminary Eligibility Checklist
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 mb-4">
                      Answer honestly. Select Yes or No for every question.
                    </p>

                    <div className="space-y-5">
                      {questions.map(question => (
                        <div key={question.key}>
                          <p className="font-medium text-gray-800">{question.label}</p>
                          <div className="flex gap-6 mt-2">
                            {[true, false].map(value => (
                              <label key={String(value)} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`${notification.id}-${question.key}`}
                                  checked={answers[notification.id]?.[question.key] === value}
                                  onChange={() => updateAnswer(notification.id, question.key, value)}
                                  className="accent-[#800020]"
                                />
                                {value ? 'Yes' : 'No'}
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => submitChecklist(notification.id)}
                      disabled={submitting === notification.id}
                      className="mt-7 w-full bg-[#800020] text-white py-3 rounded-lg font-semibold hover:bg-[#4A1428] disabled:opacity-50"
                    >
                      {submitting === notification.id ? 'Submitting...' : 'Submit Checklist'}
                    </button>
                  </div>
                )}

                {notification.status === 'ACCEPTED' && (
                  <p className="mt-5 text-green-700 bg-green-50 p-3 rounded-lg">
                    You have responded positively. The hospital can now view your contact details.
                    Please wait for the hospital to contact you.
                  </p>
                )}

                {notification.status === 'INELIGIBLE' && (
                  <p className="mt-5 text-red-700 bg-red-50 p-3 rounded-lg">
                    You were not marked eligible for this request based on your answers.
                    Please consult an authorized blood bank or healthcare professional.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DonorNotifications
