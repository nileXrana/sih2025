'use client'

import { useState, useRef, useEffect } from 'react'
import { Camera, CameraOff, Mic, MicOff, Phone, PhoneOff, MessageCircle, Users, Clock, Video, Send, Maximize, Minimize } from 'lucide-react'

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
  village: string
  symptoms: string
  urgency: 'Low' | 'Medium' | 'High' | 'Critical'
}

interface VideoConsultationProps {
  patient: Patient
  onClose: () => void
}

export default function VideoConsultation({ patient, onClose }: VideoConsultationProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'connected' | 'ended'>('idle')
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [messages, setMessages] = useState<Array<{id: string, sender: string, message: string, timestamp: string}>>([])
  const [newMessage, setNewMessage] = useState('')
  const [callDuration, setCallDuration] = useState(0)
  const [showChat, setShowChat] = useState(false)

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const localStreamRef = useRef<MediaStream | null>(null)

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

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [callStatus])

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      })
      localStreamRef.current = stream
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Unable to access camera. Please check permissions.')
    }
  }

  const startCall = async (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    setCallStatus('connecting')
    
    await initializeCamera()
    
    // Simulate connection delay
    setTimeout(() => {
      setCallStatus('connected')
      // Simulate doctor's video stream
      if (remoteVideoRef.current) {
        // In a real implementation, this would be the doctor's stream
        remoteVideoRef.current.style.background = 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)'
      }
      
      // Add initial system message
      addMessage('system', `Connected with ${doctor.name}`)
    }, 3000)
  }

  const endCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop())
    }
    setCallStatus('ended')
    setCallDuration(0)
    setTimeout(() => {
      setCallStatus('idle')
      setSelectedDoctor(null)
    }, 2000)
  }

  const toggleCamera = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsCameraOn(videoTrack.enabled)
      }
    }
  }

  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsMicOn(audioTrack.enabled)
      }
    }
  }

  const addMessage = (sender: string, message: string) => {
    const newMsg = {
      id: Date.now().toString(),
      sender,
      message,
      timestamp: new Date().toLocaleTimeString()
    }
    setMessages(prev => [...prev, newMsg])
  }

  const sendMessage = () => {
    if (newMessage.trim()) {
      addMessage('You', newMessage)
      setNewMessage('')
      
      // Simulate doctor response
      setTimeout(() => {
        const responses = [
          "I understand your concern. Let me examine this further.",
          "Based on the symptoms, I recommend the following treatment.",
          "This appears to be manageable. Let's monitor the progress.",
          "I'll prescribe some medication. Follow up in 3 days."
        ]
        addMessage(selectedDoctor?.name || 'Doctor', responses[Math.floor(Math.random() * responses.length)])
      }, 2000)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return 'text-red-600 bg-red-100'
      case 'High': return 'text-orange-600 bg-orange-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-green-600 bg-green-100'
    }
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
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(patient.urgency)}`}>
                {patient.urgency} Priority
              </div>
            </div>
            <div className="mt-4 p-4 bg-white rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Symptoms:</h4>
              <p className="text-gray-700">{patient.symptoms}</p>
            </div>
          </div>

          {/* Available Doctors */}
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
                        addMessage('system', `Text consultation requested with ${doctor.name}`)
                        setSelectedDoctor(doctor)
                        setShowChat(true)
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
        </div>
      </div>
    )
  }

  if (callStatus === 'connecting') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md mx-4">
          <div className="text-6xl mb-4">📞</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Connecting...</h3>
          <p className="text-gray-600 mb-6">Establishing connection with {selectedDoctor?.name}</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <button
            onClick={endCall}
            className="mt-6 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  if (callStatus === 'connected') {
    return (
      <div className={`fixed inset-0 bg-black z-50 ${isFullscreen ? '' : 'p-4'}`}>
        <div className={`h-full ${isFullscreen ? '' : 'rounded-2xl overflow-hidden'} bg-gray-900 relative`}>
          {/* Header Bar */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-4 z-10">
            <div className="flex justify-between items-center text-white">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">{formatDuration(callDuration)}</span>
                </div>
                <div>
                  <h3 className="font-semibold">{selectedDoctor?.name}</h3>
                  <p className="text-sm text-gray-300">{selectedDoctor?.specialization}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                >
                  {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                </button>
                <button
                  onClick={() => setShowChat(!showChat)}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <MessageCircle size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Video Area */}
          <div className="h-full flex">
            {/* Main Video Area */}
            <div className="flex-1 relative">
              {/* Remote Video (Doctor) */}
              <video
                ref={remoteVideoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-8xl mb-4">{selectedDoctor?.avatar}</div>
                  <h3 className="text-2xl font-semibold">{selectedDoctor?.name}</h3>
                  <p className="text-gray-300">{selectedDoctor?.specialization}</p>
                </div>
              </div>

              {/* Local Video (Picture-in-Picture) */}
              <div className="absolute bottom-20 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white/20">
                <video
                  ref={localVideoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />
                {!isCameraOn && (
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <CameraOff className="text-white" size={24} />
                  </div>
                )}
              </div>
            </div>

            {/* Chat Sidebar */}
            {showChat && (
              <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
                <div className="p-4 border-b bg-gray-50">
                  <h4 className="font-semibold text-gray-900">Chat</h4>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`${msg.sender === 'You' ? 'text-right' : 'text-left'}`}>
                      <div className={`inline-block max-w-xs p-3 rounded-lg ${
                        msg.sender === 'You' 
                          ? 'bg-blue-600 text-white' 
                          : msg.sender === 'system'
                          ? 'bg-gray-200 text-gray-700'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={sendMessage}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex justify-center space-x-4">
              <button
                onClick={toggleMic}
                className={`p-4 rounded-full transition-colors ${
                  isMicOn ? 'bg-gray-700 text-white' : 'bg-red-600 text-white'
                }`}
              >
                {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
              </button>
              <button
                onClick={toggleCamera}
                className={`p-4 rounded-full transition-colors ${
                  isCameraOn ? 'bg-gray-700 text-white' : 'bg-red-600 text-white'
                }`}
              >
                {isCameraOn ? <Camera size={24} /> : <CameraOff size={24} />}
              </button>
              <button
                onClick={endCall}
                className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                <PhoneOff size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (callStatus === 'ended') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md mx-4">
          <div className="text-6xl mb-4">📞</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Call Ended</h3>
          <p className="text-gray-600 mb-4">Consultation with {selectedDoctor?.name} completed</p>
          <p className="text-sm text-gray-500">Duration: {formatDuration(callDuration)}</p>
        </div>
      </div>
    )
  }

  return null
}