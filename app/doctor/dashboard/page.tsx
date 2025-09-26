'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ConsultationRoom from '@/components/ConsultationRoom'
import VideoCallRoom from '@/components/VideoCallRoom'

interface User {
  id: string
  name: string
  email: string
  role: string
  specialization?: string
  licenseNumber?: string
}

interface Consultation {
  id: string
  status: string
  symptoms: string
  isUrgent: boolean
  createdAt: string
  patient: {
    id: string
    name: string
    age: number
    gender: string
    village: string
  }
  miRoom: {
    name: string
    village: string
  }
  incharge: {
    name: string
  }
}

export default function DoctorDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [activeTab, setActiveTab] = useState('queue')
  const [loading, setLoading] = useState(true)
  const [activeConsultation, setActiveConsultation] = useState<Consultation | null>(null)
  const [showConsultationRoom, setShowConsultationRoom] = useState(false)
  const [showVideoCall, setShowVideoCall] = useState(false)
  const [incomingCall, setIncomingCall] = useState<Consultation | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Use real authentication instead of mock data
    checkAuth()
    fetchConsultations()
  }, [])

  // Set up SSE only after user is authenticated
  useEffect(() => {
    if (user) {
      setupRealtimeNotifications()
    }
  }, [user])

  const setupRealtimeNotifications = () => {
    try {
      console.log('Setting up SSE connection for user:', user?.name)
      const eventSource = new EventSource('/api/notifications/sse')
      
      eventSource.onopen = () => {
        console.log('✅ SSE connection established')
      }
      
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          console.log('📡 SSE message received:', data)
          
          switch (data.type) {
            case 'connected':
              console.log('SSE connection confirmed')
              break
            case 'new_consultation':
            case 'urgent_consultation':
              // Refresh consultations when new ones arrive
              fetchConsultations()
              
              // Show notification for urgent consultations
              if (data.type === 'urgent_consultation') {
                console.log('🚨 URGENT CONSULTATION:', data.data.consultation.symptoms)
              }
              break
            case 'consultation_accepted':
              fetchConsultations()
              break
            case 'ping':
              // Keep-alive ping, do nothing
              break
          }
        } catch (error) {
          console.error('Error parsing SSE data:', error)
        }
      }

      eventSource.onerror = (error) => {
        console.error('SSE connection error:', error)
        console.error('SSE readyState:', eventSource.readyState)
        
        // Try to reconnect after a delay if connection fails
        if (eventSource.readyState === EventSource.CLOSED) {
          console.log('SSE connection closed, will retry in 5 seconds...')
          setTimeout(() => {
            if (user) {
              setupRealtimeNotifications()
            }
          }, 5000)
        }
      }

      // Cleanup on component unmount
      return () => {
        console.log('🔌 Closing SSE connection')
        eventSource.close()
      }
    } catch (error) {
      console.error('Failed to setup SSE:', error)
    }
  }

  const checkAuth = async () => {
    try {
      console.log('Dashboard - Checking auth...')
      const response = await fetch('/api/auth/me')
      console.log('Dashboard - Auth response status:', response.status)
      if (response.ok) {
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json()
          console.log('Dashboard - User data received:', data)
          setUser(data.user)
        } else {
          console.warn('Auth API response is not JSON:', contentType)
          router.push('/doctor/login')
        }
      } else {
        console.log('Dashboard - Auth failed, redirecting to login')
        router.push('/doctor/login')
      }
    } catch (error) {
      console.error('Dashboard - Auth check failed:', error)
      router.push('/doctor/login')
    } finally {
      setLoading(false)
    }
  }

  const fetchConsultations = async () => {
    try {
      const response = await fetch('/api/consultations')
      if (response.ok) {
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json()
          setConsultations(data.consultations || [])
        } else {
          console.warn('Consultations API response is not JSON:', contentType)
          throw new Error('Invalid response format')
        }
      } else {
        console.error('Failed to fetch consultations:', response.status)
        setConsultations([])
      }
    } catch (error) {
      console.error('Failed to fetch consultations:', error)
      setConsultations([])
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const acceptConsultation = async (consultationId: string) => {
    try {
      const response = await fetch(`/api/consultations/${consultationId}/accept`, {
        method: 'POST'
      })
      if (response.ok) {
        fetchConsultations()
      }
    } catch (error) {
      console.error('Failed to accept consultation:', error)
    }
  }

  const startConsultation = (consultation: Consultation) => {
    setActiveConsultation(consultation)
    setShowConsultationRoom(true)
  }

  const startVideoCall = async (consultation: Consultation) => {
    try {
      console.log('🎥 Starting video call for consultation:', consultation.id)
      
      // Redirect to external video consultation platform
      window.open('https://quickconnectfrontend.onrender.com/home', '_blank')
      
      // Optional: Still notify the system about video call initiation for tracking
      const response = await fetch('/api/video-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          consultationId: consultation.id,
          action: 'initiate'
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Video call initiated successfully:', data)
      } else {
        console.error('❌ Failed to initiate video call:', response.status)
      }
    } catch (error) {
      console.error('❌ Error initiating video call:', error)
    }
  }

  const endConsultation = () => {
    setActiveConsultation(null)
    setShowConsultationRoom(false)
    setShowVideoCall(false)
    fetchConsultations() // Refresh the list
  }

  const answerVideoCall = (consultation: Consultation) => {
    // Redirect to external video consultation platform
    window.open('https://quickconnectfrontend.onrender.com/home', '_blank')
    setIncomingCall(null) // Clear the incoming call notification
  }

  const rejectVideoCall = () => {
    setIncomingCall(null)
  }

  const generatePrescription = () => {
    // In real app, this would open a prescription modal or redirect to prescription page
    console.log('Generating prescription for:', activeConsultation?.id)
  }

  if (showConsultationRoom && activeConsultation) {
    return (
      <ConsultationRoom
        consultationId={activeConsultation.id}
        patientName={activeConsultation.patient.name}
        patientAge={activeConsultation.patient.age}
        patientGender={activeConsultation.patient.gender}
        symptoms={activeConsultation.symptoms}
        isUrgent={activeConsultation.isUrgent}
        onEndConsultation={endConsultation}
        onPrescribe={generatePrescription}
      />
    )
  }

  if (showVideoCall && activeConsultation) {
    return (
      <VideoCallRoom
        consultationId={activeConsultation.id}
        localUser={{
          id: user?.id || 'doctor_1',
          name: user?.name || 'Dr. Test',
          role: 'HOSPITAL_DOCTOR',
          avatar: '👨‍⚕️'
        }}
        remoteUser={{
          id: activeConsultation.id + '_incharge',
          name: activeConsultation.incharge.name,
          role: 'MI_ROOM_INCHARGE',
          avatar: '🏥'
        }}
        patientInfo={{
          name: activeConsultation.patient.name,
          age: activeConsultation.patient.age,
          gender: activeConsultation.patient.gender,
          symptoms: activeConsultation.symptoms,
          urgency: activeConsultation.isUrgent ? 'High' : 'Medium'
        }}
        onEndCall={endConsultation}
        onPrescribe={generatePrescription}
      />
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const pendingConsultations = consultations.filter(c => c.status === 'PENDING')
  const activeConsultations = consultations.filter(c => c.status === 'IN_PROGRESS')
  const completedConsultations = consultations.filter(c => c.status === 'COMPLETED')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl shadow-lg">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
                <p className="text-gray-600 text-lg">Dr. {user?.name} • {user?.specialization || 'General Medicine'}</p>
                <p className="text-sm text-gray-500">License: {user?.licenseNumber || 'DEMO123'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Current Time</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-medium shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1">
            {[
              { 
                id: 'queue', 
                name: 'Consultation Queue', 
                icon: '🩺',
                count: pendingConsultations.length,
                color: 'red'
              },
              { 
                id: 'active', 
                name: 'Active Consultations', 
                icon: '💬',
                count: activeConsultations.length,
                color: 'blue'
              },
              { 
                id: 'completed', 
                name: 'Completed', 
                icon: '✅',
                count: completedConsultations.length,
                color: 'green'
              },
              { 
                id: 'analytics', 
                name: 'Analytics', 
                icon: '📊',
                color: 'purple'
              }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-6 border-b-3 font-semibold text-sm flex items-center rounded-t-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? `border-${tab.color}-500 text-${tab.color}-600 bg-${tab.color}-50`
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="mr-3 text-lg">{tab.icon}</span>
                {tab.name}
                {tab.count !== undefined && (
                  <span className={`ml-3 px-3 py-1 text-xs rounded-full font-bold ${
                    activeTab === tab.id 
                      ? `bg-${tab.color}-100 text-${tab.color}-700` 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {activeTab === 'queue' && (
            <div className="space-y-6">
              <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-4">
                  <h3 className="text-xl font-bold text-white">
                    🩺 Pending Consultation Requests
                  </h3>
                  <p className="mt-1 text-red-100">
                    New consultation requests from MI Rooms waiting for your review.
                  </p>
                </div>
                <div className="p-6">
                  {pendingConsultations.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">No pending consultations</h3>
                      <p className="mt-1 text-gray-500">All consultation requests have been addressed.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {pendingConsultations.map((consultation) => (
                        <div key={consultation.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-gradient-to-r from-white to-gray-50">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4 flex-1">
                              {consultation.isUrgent && (
                                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                                  🚨 URGENT
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="text-xl font-bold text-gray-900">
                                    {consultation.patient.name}
                                  </h4>
                                  <div className="text-right">
                                    <span className="text-sm text-gray-500">
                                      {new Date(consultation.createdAt).toLocaleDateString()}
                                    </span>
                                    <br />
                                    <span className="text-sm font-medium text-gray-700">
                                      {new Date(consultation.createdAt).toLocaleTimeString()}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div className="bg-blue-50 p-3 rounded-lg">
                                    <p className="text-sm font-medium text-blue-800">Patient Details</p>
                                    <p className="text-gray-700">{consultation.patient.age} years • {consultation.patient.gender}</p>
                                    <p className="text-gray-600 text-sm">{consultation.patient.village}</p>
                                  </div>
                                  <div className="bg-green-50 p-3 rounded-lg">
                                    <p className="text-sm font-medium text-green-800">MI Room</p>
                                    <p className="text-gray-700">{consultation.miRoom.name}</p>
                                    <p className="text-gray-600 text-sm">{consultation.miRoom.village}</p>
                                  </div>
                                </div>

                                <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                                  <p className="text-sm font-medium text-yellow-800 mb-2">📋 Symptoms</p>
                                  <p className="text-gray-700">{consultation.symptoms}</p>
                                </div>

                                <div className="text-sm text-gray-600">
                                  <p><strong>Incharge:</strong> {consultation.incharge.name}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col space-y-3 ml-6">
                              <button
                                onClick={() => startVideoCall(consultation)}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                              >
                                🎥 Start Video Call
                              </button>
                              <button
                                onClick={() => startConsultation(consultation)}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                              >
                                💬 Text Consultation
                              </button>
                              <button
                                onClick={() => acceptConsultation(consultation.id)}
                                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                              >
                                ✅ Accept Consultation
                              </button>
                              <button className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-300 transition-colors">
                                📋 View Patient History
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'active' && (
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4">
                <h3 className="text-xl font-bold text-white">
                  💬 Active Consultations
                </h3>
                <p className="mt-1 text-blue-100">
                  Consultations currently in progress.
                </p>
              </div>
              <div className="p-6">
                {activeConsultations.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">No active consultations</h3>
                    <p className="mt-1 text-gray-500">Start a consultation from the queue to see it here.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {activeConsultations.map((consultation) => (
                      <div key={consultation.id} className="border border-blue-200 rounded-xl p-6 bg-gradient-to-r from-blue-50 to-cyan-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center">
                              <span className="text-lg font-bold">
                                {consultation.patient.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-gray-900">
                                {consultation.patient.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {consultation.patient.age} years • {consultation.patient.gender}
                              </p>
                              <p className="text-sm text-blue-600 font-medium">
                                In consultation • {consultation.miRoom.name}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-3">
                            <button
                              onClick={() => startVideoCall(consultation)}
                              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                              🎥 Video Call
                            </button>
                            <button
                              onClick={() => startConsultation(consultation)}
                              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                              💬 Text Chat
                            </button>
                            <button
                              onClick={() => endConsultation()}
                              className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:from-red-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                              ✅ Complete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Today's Consultations</p>
                      <p className="text-3xl font-bold">{consultations.length}</p>
                    </div>
                    <div className="bg-blue-400 bg-opacity-30 p-3 rounded-xl">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Completed Today</p>
                      <p className="text-3xl font-bold">{completedConsultations.length}</p>
                    </div>
                    <div className="bg-green-400 bg-opacity-30 p-3 rounded-xl">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100 text-sm font-medium">Avg. Response Time</p>
                      <p className="text-3xl font-bold">2.5 min</p>
                    </div>
                    <div className="bg-yellow-400 bg-opacity-30 p-3 rounded-xl">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Analytics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Weekly Overview</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Monday</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{width: '75%'}}></div>
                        </div>
                        <span className="text-sm font-medium">12</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tuesday</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{width: '90%'}}></div>
                        </div>
                        <span className="text-sm font-medium">15</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Wednesday</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{width: '60%'}}></div>
                        </div>
                        <span className="text-sm font-medium">8</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Today</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: '45%'}}></div>
                        </div>
                        <span className="text-sm font-medium">{consultations.length}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">🏥 Patient Demographics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Male Patients</span>
                      <span className="text-lg font-bold text-blue-600">65%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Female Patients</span>
                      <span className="text-lg font-bold text-pink-600">35%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Age 0-18</span>
                      <span className="text-lg font-bold text-green-600">25%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Age 18-60</span>
                      <span className="text-lg font-bold text-yellow-600">60%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Age 60+</span>
                      <span className="text-lg font-bold text-red-600">15%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}