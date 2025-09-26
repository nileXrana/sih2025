'use client'

import { useState, useRef, useEffect } from 'react'
import { Camera, CameraOff, Mic, MicOff, Phone, PhoneOff, MessageCircle, Users, Clock, Video, Send, Maximize, Minimize, ScreenShare, ScreenShareOff } from 'lucide-react'

interface VideoCallRoomProps {
  consultationId: string
  localUser: {
    id: string
    name: string
    role: 'MI_ROOM_INCHARGE' | 'HOSPITAL_DOCTOR'
    avatar?: string
  }
  remoteUser: {
    id: string
    name: string
    role: 'MI_ROOM_INCHARGE' | 'HOSPITAL_DOCTOR'
    avatar?: string
  }
  patientInfo?: {
    name: string
    age: number
    gender: string
    symptoms: string
    urgency: 'Low' | 'Medium' | 'High' | 'Critical'
  }
  onEndCall: () => void
  onPrescribe?: () => void
}

export default function VideoCallRoom({
  consultationId,
  localUser,
  remoteUser,
  patientInfo,
  onEndCall,
  onPrescribe
}: VideoCallRoomProps) {
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting')
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [messages, setMessages] = useState<Array<{id: string, sender: string, message: string, timestamp: string}>>([])
  const [newMessage, setNewMessage] = useState('')
  const [showChat, setShowChat] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [connectionState, setConnectionState] = useState<string>('connecting')

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const screenStreamRef = useRef<MediaStream | null>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const dataChannelRef = useRef<RTCDataChannel | null>(null)

  useEffect(() => {
    initializeCall()
    return () => cleanup()
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [callStatus])

  const initializeCall = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })

      localStreamRef.current = stream
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

      // Initialize peer connection
      peerConnectionRef.current = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' }
        ]
      })

      // Add local stream tracks
      stream.getTracks().forEach(track => {
        peerConnectionRef.current?.addTrack(track, stream)
      })

      // Handle remote stream
      peerConnectionRef.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0]
        }
      }

      // Handle ICE candidates
      peerConnectionRef.current.onicecandidate = async (event) => {
        if (event.candidate) {
          await sendSignalingData('ice-candidate', event.candidate)
        }
      }

      // Handle connection state changes
      peerConnectionRef.current.onconnectionstatechange = () => {
        if (peerConnectionRef.current) {
          setConnectionState(peerConnectionRef.current.connectionState)
          if (peerConnectionRef.current.connectionState === 'connected') {
            setCallStatus('connected')
          }
        }
      }

      // Create data channel for chat
      dataChannelRef.current = peerConnectionRef.current.createDataChannel('chat', {
        ordered: true
      })

      dataChannelRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data)
        addMessage(message.sender, message.text)
      }

      dataChannelRef.current.onopen = () => {
        console.log('Data channel opened')
      }

      // Handle incoming data channel
      peerConnectionRef.current.ondatachannel = (event) => {
        const channel = event.channel
        channel.onmessage = (event) => {
          const message = JSON.parse(event.data)
          addMessage(message.sender, message.text)
        }
      }

      // Start signaling process
      if (localUser.role === 'MI_ROOM_INCHARGE') {
        await initiateCall()
      } else {
        await waitForCall()
      }

    } catch (error) {
      console.error('Error initializing call:', error)
      alert('Unable to access camera/microphone. Please check permissions.')
    }
  }

  const initiateCall = async () => {
    try {
      const offer = await peerConnectionRef.current!.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      })

      await peerConnectionRef.current!.setLocalDescription(offer)
      await sendSignalingData('offer', offer)

      // Poll for answer
      pollForAnswer()
    } catch (error) {
      console.error('Error creating offer:', error)
    }
  }

  const waitForCall = async () => {
    // Poll for offer
    pollForOffer()
  }

  const pollForOffer = async () => {
    const poll = async () => {
      try {
        const response = await fetch(`/api/webrtc/signaling?consultationId=${consultationId}&type=offer`)
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json()
          
          if (data.offer) {
            await handleOffer(data.offer)
          } else {
            setTimeout(poll, 1000)
          }
        } else {
          console.warn('WebRTC signaling response is not JSON:', contentType)
          setTimeout(poll, 1000)
        }
      } catch (error) {
        console.error('Error polling for offer:', error)
        setTimeout(poll, 1000)
      }
    }
    poll()
  }

  const pollForAnswer = async () => {
    const poll = async () => {
      try {
        const response = await fetch(`/api/webrtc/signaling?consultationId=${consultationId}&type=answer`)
        const data = await response.json()
        
        if (data.answer) {
          await handleAnswer(data.answer)
        } else {
          setTimeout(poll, 1000)
        }
      } catch (error) {
        console.error('Error polling for answer:', error)
        setTimeout(poll, 1000)
      }
    }
    poll()
  }

  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    try {
      await peerConnectionRef.current!.setRemoteDescription(offer)
      const answer = await peerConnectionRef.current!.createAnswer()
      await peerConnectionRef.current!.setLocalDescription(answer)
      await sendSignalingData('answer', answer)
    } catch (error) {
      console.error('Error handling offer:', error)
    }
  }

  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    try {
      await peerConnectionRef.current!.setRemoteDescription(answer)
    } catch (error) {
      console.error('Error handling answer:', error)
    }
  }

  const sendSignalingData = async (type: string, data: any) => {
    try {
      await fetch('/api/webrtc/signaling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          consultationId,
          data
        })
      })
    } catch (error) {
      console.error('Error sending signaling data:', error)
    }
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

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        })

        screenStreamRef.current = screenStream

        // Replace video track
        const videoTrack = screenStream.getVideoTracks()[0]
        const sender = peerConnectionRef.current?.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        )

        if (sender && peerConnectionRef.current) {
          await sender.replaceTrack(videoTrack)
        }

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream
        }

        setIsScreenSharing(true)

        // Handle screen share end
        screenStream.getVideoTracks()[0].onended = () => {
          stopScreenShare()
        }
      } else {
        stopScreenShare()
      }
    } catch (error) {
      console.error('Error sharing screen:', error)
    }
  }

  const stopScreenShare = () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop())
      screenStreamRef.current = null
    }

    if (localStreamRef.current && localVideoRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current
    }

    // Restore original video track
    const videoTrack = localStreamRef.current?.getVideoTracks()[0]
    const sender = peerConnectionRef.current?.getSenders().find(s => 
      s.track && s.track.kind === 'video'
    )

    if (sender && videoTrack) {
      sender.replaceTrack(videoTrack)
    }

    setIsScreenSharing(false)
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
    if (newMessage.trim() && dataChannelRef.current?.readyState === 'open') {
      const message = {
        sender: localUser.name,
        text: newMessage
      }
      dataChannelRef.current.send(JSON.stringify(message))
      addMessage('You', newMessage)
      setNewMessage('')
    }
  }

  const endCall = () => {
    cleanup()
    setCallStatus('ended')
    setTimeout(() => {
      onEndCall()
    }, 2000)
  }

  const cleanup = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop())
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop())
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
    }
    // Clear signaling data
    fetch('/api/webrtc/signaling', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'clear',
        consultationId
      })
    })
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

  if (callStatus === 'ended') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md mx-4">
          <div className="text-6xl mb-4">📞</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Call Ended</h3>
          <p className="text-gray-600 mb-4">Consultation with {remoteUser.name} completed</p>
          <p className="text-sm text-gray-500">Duration: {formatDuration(callDuration)}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`fixed inset-0 bg-black z-50 ${isFullscreen ? '' : 'p-4'}`}>
      <div className={`h-full ${isFullscreen ? '' : 'rounded-2xl overflow-hidden'} bg-gray-900 relative`}>
        {/* Header Bar */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-4 z-10">
          <div className="flex justify-between items-center text-white">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  connectionState === 'connected' ? 'bg-green-500' : 
                  connectionState === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="font-medium">{formatDuration(callDuration)}</span>
              </div>
              <div>
                <h3 className="font-semibold">{remoteUser.name}</h3>
                <p className="text-sm text-gray-300">
                  {remoteUser.role === 'HOSPITAL_DOCTOR' ? 'Doctor' : 'MI Room Incharge'}
                </p>
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
            {/* Remote Video */}
            <video
              ref={remoteVideoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-8xl mb-4">{remoteUser.avatar || '👤'}</div>
                <h3 className="text-2xl font-semibold">{remoteUser.name}</h3>
                <p className="text-gray-300">
                  {remoteUser.role === 'HOSPITAL_DOCTOR' ? 'Doctor' : 'MI Room Incharge'}
                </p>
                {connectionState === 'connecting' && (
                  <p className="text-yellow-300 mt-2">Connecting...</p>
                )}
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

          {/* Patient Info Sidebar (for Doctors) */}
          {patientInfo && localUser.role === 'HOSPITAL_DOCTOR' && (
            <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
              <div className="p-4 border-b bg-gray-50">
                <h4 className="font-semibold text-gray-900">Patient Information</h4>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold">{patientInfo.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{patientInfo.name}</h3>
                    <p className="text-sm text-gray-600">{patientInfo.age} years, {patientInfo.gender}</p>
                  </div>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(patientInfo.urgency)}`}>
                  {patientInfo.urgency} Priority
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-yellow-800 mb-2">Symptoms</h4>
                  <p className="text-gray-700 text-sm">{patientInfo.symptoms}</p>
                </div>

                {onPrescribe && (
                  <button
                    onClick={onPrescribe}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Generate Prescription
                  </button>
                )}
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
              onClick={toggleScreenShare}
              className={`p-4 rounded-full transition-colors ${
                isScreenSharing ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white'
              }`}
            >
              {isScreenSharing ? <ScreenShareOff size={24} /> : <ScreenShare size={24} />}
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
