'use client'

import { useState } from 'react'
import { Video, MessageCircle } from 'lucide-react'
import VideoCallRoom from './VideoCallRoom'

interface Doctor {
  id: string
  name: string
  specialization: string
  isAvailable: boolean
  rating: number
  nextAvailable?: string
  avatar?: string
}

interface Patient {
  id: string
  name: string
  age: number
  gender: string
  village?: string
  symptoms: string
  urgency?: 'Low' | 'Medium' | 'High' | 'Critical'
  doctor?: Doctor
  consultationId?: string
}

interface VideoConsultationProps {
  patient: Patient
  consultationId?: string
  onClose: () => void
}

export default function VideoConsultation({ patient, consultationId, onClose }: VideoConsultationProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(patient.doctor || null)
  const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'connected' | 'ended'>(patient.doctor ? 'connecting' : 'idle')

  const availableDoctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Rajesh Kumar',
      specialization: 'General Medicine',
      isAvailable: true,
      rating: 4.8,
      avatar: '👨‍⚕️'
    },
    {
      id: '2',
      name: 'Dr. Priya Sharma',
      specialization: 'Cardiology',
      isAvailable: true,
      rating: 4.9,
      nextAvailable: '2:30 PM',
      avatar: '👩‍⚕️'
    },
    {
      id: '3',
      name: 'Dr. Arjun Singh',
      specialization: 'Pediatrics',
      isAvailable: false,
      nextAvailable: '4:00 PM',
      rating: 4.7,
      avatar: '👨‍⚕️'
    },
    {
      id: '4',
      name: 'Dr. Sunita Devi',
      specialization: 'Emergency Medicine',
      isAvailable: true,
      rating: 4.9,
      avatar: '👩‍⚕️'
    }
  ]

  const startCall = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    setCallStatus('connecting')
  }

  const endCall = () => {
    setCallStatus('ended')
    setTimeout(() => {
      setCallStatus('idle')
      setSelectedDoctor(null)
    }, 2000)
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return 'text-red-600 bg-red-100'
      case 'High': return 'text-orange-600 bg-orange-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-green-600 bg-green-100'
    }
  }

  // If we have a selected doctor and are connecting/connected, show the video call room
  if (selectedDoctor && (callStatus === 'connecting' || callStatus === 'connected')) {
    return (
      <VideoCallRoom
        consultationId={consultationId || `consult_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`}
        localUser={{
          id: 'mi_incharge_1',
          name: 'MI Room Incharge',
          role: 'MI_ROOM_INCHARGE',
          avatar: '🏥'
        }}
        remoteUser={{
          id: selectedDoctor.id,
          name: selectedDoctor.name,
          role: 'HOSPITAL_DOCTOR',
          avatar: selectedDoctor.avatar
        }}
        patientInfo={{
          name: patient.name,
          age: patient.age,
          gender: patient.gender,
          symptoms: patient.symptoms,
          urgency: patient.urgency || 'Medium'
        }}
        onEndCall={endCall}
      />
    )
  }

  if (callStatus === 'idle') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">🎥 Video Consultation</h2>
                <p className="text-blue-100">Connect with specialist doctors</p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Patient Info */}
          <div className="p-6 bg-gray-50 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{patient.name}</h3>
                <p className="text-gray-600">{patient.age} years • {patient.gender} • {patient.village}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(patient.urgency || 'Medium')}`}>
                {patient.urgency || 'Medium'} Priority
              </div>
            </div>
            <div className="mt-4 p-4 bg-white rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Symptoms:</h4>
              <p className="text-gray-700">{patient.symptoms}</p>
            </div>
          </div>

          {/* Available Doctors - Only show if no doctor is already assigned */}
          {!patient.doctor && (
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Available Specialists</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableDoctors.map((doctor) => (
                <div key={doctor.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{doctor.avatar}</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
                        <p className="text-gray-600 text-sm">{doctor.specialization}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-yellow-400 mb-1">
                        ⭐ <span className="text-gray-600 ml-1 text-sm">{doctor.rating}</span>
                      </div>
                      {doctor.isAvailable ? (
                        <span className="text-green-600 text-sm font-medium">🟢 Available Now</span>
                      ) : (
                        <span className="text-orange-600 text-sm">🟡 Next: {doctor.nextAvailable}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => startCall(doctor)}
                      disabled={!doctor.isAvailable}
                      className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                        doctor.isAvailable
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <Video size={18} />
                      <span>Video Call</span>
                    </button>
                    <button
                      onClick={() => {
                        // For now, just start a video call for text consultation too
                        startCall(doctor)
                      }}
                      className="flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      <MessageCircle size={18} />
                      <span>Text</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            </div>
          )}
          
          {/* Incoming Call Notification - Show when doctor is already assigned */}
          {patient.doctor && (
            <div className="p-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                <div className="text-4xl mb-4">📞</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Incoming Video Call</h3>
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="text-2xl">{patient.doctor.avatar || '👨‍⚕️'}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{patient.doctor.name}</h4>
                    <p className="text-gray-600 text-sm">{patient.doctor.specialization}</p>
                  </div>
                </div>
                <div className="flex space-x-4 justify-center">
                  <button
                    onClick={() => startCall(patient.doctor!)}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 flex items-center space-x-2"
                  >
                    <Video size={18} />
                    <span>Accept Call</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}