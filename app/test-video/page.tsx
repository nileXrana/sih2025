'use client'

import { useState, useEffect } from 'react'
import VideoCallRoom from '@/components/VideoCallRoom'

interface Consultation {
  id: string
  patient: {
    name: string
    age: number
    gender: string
    village: string
  }
  symptoms: string
  isUrgent: boolean
  incharge: {
    name: string
  }
  miRoom: {
    name: string
    village: string
  }
}

export default function TestVideoPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null)
  const [showVideoCall, setShowVideoCall] = useState(false)
  const [userType, setUserType] = useState<'mi' | 'doctor'>('mi')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConsultations()
  }, [])

  const fetchConsultations = async () => {
    try {
      const response = await fetch('/api/consultations')
      if (response.ok) {
        const data = await response.json()
        setConsultations(data.consultations || [])
      }
    } catch (error) {
      console.error('Error fetching consultations:', error)
    } finally {
      setLoading(false)
    }
  }

  const createTestConsultation = async () => {
    try {
      const response = await fetch('/api/consultations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: 'patient_1',
          symptoms: 'Fever, headache, and body ache for 2 days',
          vitals: {
            temperature: '101.2',
            bloodPressure: '120/80',
            heartRate: '85',
            respiratoryRate: '18',
            oxygenSaturation: '98'
          },
          isUrgent: false,
          miRoomId: 'miroom_1',
          inchargeId: 'incharge_1'
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Test consultation created:', data.consultation)
        fetchConsultations() // Refresh the list
      }
    } catch (error) {
      console.error('Error creating test consultation:', error)
    }
  }

  const startVideoCall = (consultation: Consultation) => {
    setSelectedConsultation(consultation)
    setShowVideoCall(true)
  }

  if (showVideoCall && selectedConsultation) {
    return (
      <VideoCallRoom
        consultationId={selectedConsultation.id}
        localUser={userType === 'mi' ? {
          id: 'mi_incharge_1',
          name: 'MI Room Incharge',
          role: 'MI_ROOM_INCHARGE',
          avatar: '🏥'
        } : {
          id: 'doctor_1',
          name: 'Dr. Rajesh Kumar',
          role: 'HOSPITAL_DOCTOR',
          avatar: '👨‍⚕️'
        }}
        remoteUser={userType === 'mi' ? {
          id: 'doctor_1',
          name: 'Dr. Rajesh Kumar',
          role: 'HOSPITAL_DOCTOR',
          avatar: '👨‍⚕️'
        } : {
          id: 'mi_incharge_1',
          name: 'MI Room Incharge',
          role: 'MI_ROOM_INCHARGE',
          avatar: '🏥'
        }}
        patientInfo={{
          name: selectedConsultation.patient.name,
          age: selectedConsultation.patient.age,
          gender: selectedConsultation.patient.gender,
          symptoms: selectedConsultation.symptoms,
          urgency: selectedConsultation.isUrgent ? 'High' : 'Medium'
        }}
        onEndCall={() => setShowVideoCall(false)}
        onPrescribe={() => console.log('Generate prescription')}
      />
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">🎥 Video Call Test</h1>
          <p className="text-gray-600 mb-6">
            Test video calling between MI Room Incharges and Doctors using real consultation data
          </p>

          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setUserType('mi')}
              className={`px-4 py-2 rounded-lg font-medium ${
                userType === 'mi' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              🏥 MI Room Incharge
            </button>
            <button
              onClick={() => setUserType('doctor')}
              className={`px-4 py-2 rounded-lg font-medium ${
                userType === 'doctor' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              👨‍⚕️ Doctor
            </button>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-yellow-800 mb-2">📋 Instructions:</h3>
            <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
              <li>Open this page in two different browser tabs</li>
              <li>In one tab, select "MI Room Incharge" and in the other select "Doctor"</li>
              <li>Click "Create Test Consultation" to create a new consultation</li>
              <li>Both tabs will see the same consultation in the list</li>
              <li>Click "Start Video Call" on the same consultation from both tabs</li>
              <li>Allow camera/microphone permissions when prompted</li>
              <li>The video call should connect between the two tabs</li>
            </ol>
          </div>

          <button
            onClick={createTestConsultation}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Create Test Consultation
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Consultations ({consultations.length})
          </h2>
          
          {consultations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No consultations found. Create a test consultation to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {consultations.map((consultation) => (
                <div key={consultation.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {consultation.patient.name}
                        </h3>
                        <span className="text-sm text-gray-600">
                          {consultation.patient.age} years, {consultation.patient.gender}
                        </span>
                        <span className="text-sm text-gray-500">
                          {consultation.patient.village}
                        </span>
                        {consultation.isUrgent && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                            URGENT
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 mb-2">{consultation.symptoms}</p>
                      <div className="text-sm text-gray-500">
                        <p>MI Room: {consultation.miRoom.name} ({consultation.miRoom.village})</p>
                        <p>Incharge: {consultation.incharge.name}</p>
                      </div>
                    </div>
                    <div className="ml-4">
                      <button
                        onClick={() => startVideoCall(consultation)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        🎥 Start Video Call
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
