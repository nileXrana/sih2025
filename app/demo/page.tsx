'use client'

import { useState } from 'react'
import VideoCallRoom from '@/components/VideoCallRoom'

export default function DemoPage() {
  const [showVideoCall, setShowVideoCall] = useState(false)
  const [callType, setCallType] = useState<'mi-to-doctor' | 'doctor-to-mi'>('mi-to-doctor')

  const startVideoCall = (type: 'mi-to-doctor' | 'doctor-to-mi') => {
    setCallType(type)
    setShowVideoCall(true)
  }

  if (showVideoCall) {
    return (
      <VideoCallRoom
        consultationId={`demo_${Date.now()}`}
        localUser={callType === 'mi-to-doctor' ? {
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
        remoteUser={callType === 'mi-to-doctor' ? {
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
          name: 'Rajesh Kumar',
          age: 45,
          gender: 'Male',
          symptoms: 'Fever and headache for 2 days',
          urgency: 'Medium'
        }}
        onEndCall={() => setShowVideoCall(false)}
        onPrescribe={() => console.log('Generate prescription')}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">🎥 Video Call Demo</h1>
          <p className="text-gray-600">
            Test the video calling functionality between MI Room Incharges and Doctors
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">MI Room to Doctor Call</h2>
            <p className="text-gray-700 mb-4">
              Simulate an MI Room Incharge calling a Doctor for consultation
            </p>
            <button
              onClick={() => startVideoCall('mi-to-doctor')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              🏥 Start as MI Room Incharge
            </button>
          </div>

          <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Doctor to MI Room Call</h2>
            <p className="text-gray-700 mb-4">
              Simulate a Doctor calling an MI Room Incharge for consultation
            </p>
            <button
              onClick={() => startVideoCall('doctor-to-mi')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              👨‍⚕️ Start as Doctor
            </button>
          </div>
        </div>

        <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">📋 Instructions:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Allow camera and microphone permissions when prompted</li>
            <li>• The video call will start automatically</li>
            <li>• Use the controls at the bottom to toggle camera/mic</li>
            <li>• Click the chat icon to open text messaging</li>
            <li>• Click the screen share button to share your screen</li>
            <li>• Click the red phone button to end the call</li>
          </ul>
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