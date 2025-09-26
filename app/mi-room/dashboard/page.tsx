'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import VideoConsultation from '@/components/VideoConsultation'
import { useLanguage, LanguageSelector } from "@/lib/LanguageContext"
import { getTranslation } from "@/lib/translations"
import { safeJsonResponse } from '@/lib/api-utils'

interface User {
  id: string
  name: string
  email: string
  role: string
  miRoomId?: string
}

interface Patient {
  id: string
  name: string
  age: number
  gender: string
  phone?: string
  village: string
  createdAt: string
}

export default function MIRoomDashboard() {
  const { language } = useLanguage()
  const [user, setUser] = useState<User | null>(null)
  const [patients, setPatients] = useState<Patient[]>([])
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [showVideoConsultation, setShowVideoConsultation] = useState(false)
  const [selectedPatientForConsultation, setSelectedPatientForConsultation] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchPatients()
  }, [])

  // Set up SSE for incoming video calls after user is authenticated
  useEffect(() => {
    if (user) {
      setupIncomingCallNotifications()
    }
  }, [user])

  const checkAuth = async () => {
    try {
      console.log('MI Room - Checking auth...')
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json()
          console.log('MI Room - User data received:', data)
          setUser(data.user)
        } else {
          console.warn('MI Room - Auth API response is not JSON:', contentType)
          router.push('/mi-room/login')
        }
      } else {
        console.log('MI Room - Auth failed, redirecting to login')
        router.push('/mi-room/login')
      }
    } catch (error) {
      console.error('MI Room - Auth check failed:', error)
      router.push('/mi-room/login')
    } finally {
      setLoading(false)
    }
  }

  const setupIncomingCallNotifications = () => {
    try {
      console.log('🔔 Setting up incoming call notifications for MI Room user:', user?.name)
      const eventSource = new EventSource('/api/notifications/mi-room-sse')
      
      eventSource.onopen = () => {
        console.log('✅ MI Room SSE connection established')
      }
      
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          console.log('📡 MI Room SSE message received:', data)
          
          switch (data.type) {
            case 'video_call_incoming':
              console.log('📞 Incoming video call from doctor:', data.data.doctor.name)
              handleIncomingVideoCall(data.data)
              break
            case 'connected':
              console.log('MI Room SSE connection confirmed')
              break
            case 'ping':
              // Keep-alive ping
              break
          }
        } catch (error) {
          console.error('Error parsing MI Room SSE data:', error)
        }
      }

      eventSource.onerror = (error) => {
        console.error('MI Room SSE connection error:', error)
      }

      // Cleanup on component unmount
      return () => {
        console.log('🔌 Closing MI Room SSE connection')
        eventSource.close()
      }
    } catch (error) {
      console.error('Failed to setup MI Room SSE:', error)
    }
  }

  const handleIncomingVideoCall = (callData: any) => {
    console.log('📞 Handling incoming video call:', callData)
    // Set the patient and consultation data for the video call
    setSelectedPatientForConsultation({
      id: callData.consultation.patient.id,
      name: callData.consultation.patient.name,
      age: callData.consultation.patient.age,
      gender: callData.consultation.patient.gender,
      symptoms: callData.consultation.symptoms,
      consultationId: callData.consultationId,
      doctor: callData.doctor
    })
    setShowVideoConsultation(true)
  }

  const fetchPatients = async () => {
    try {
      console.log('📋 Fetching patients...')
      const response = await fetch('/api/patients')
      console.log('📋 Patients API response status:', response.status)
      if (response.ok) {
        const data = await safeJsonResponse(response)
        console.log('📋 Patients data received:', data)
        setPatients(data.patients || [])
        console.log('📋 Number of patients loaded:', data.patients?.length || 0)
      } else {
        console.error('Failed to fetch patients:', response.status)
        const errorText = await response.text()
        console.error('Error response:', errorText)
        setPatients([])
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
      setPatients([])
    }
  }

  const handleLogout = () => {
    // Prototype mode - direct redirect
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="bg-green-600 text-white p-2 rounded-lg mr-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{getTranslation('dashboardTitle', language) as string}</h1>
                <p className="text-gray-600">{getTranslation('welcomeMessage', language) as string}, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <button
                onClick={handleLogout}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {getTranslation('logout', language) as string}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: getTranslation('overview', language) as string, icon: '📊' },
              { id: 'patients', name: getTranslation('recentPatients', language) as string, icon: '👥' },
              { id: 'symptoms', name: getTranslation('symptomDetection', language) as string, icon: '🔍' },
              { id: 'consultations', name: getTranslation('todayConsultations', language) as string, icon: '🩺' },
              { id: 'register', name: getTranslation('patientRegistration', language) as string, icon: '➕' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stats Cards */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-green-100 p-3 rounded-md">
                        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {getTranslation('totalPatients', language) as string}
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {patients.length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-blue-100 p-3 rounded-md">
                        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {getTranslation('todayConsultations', language) as string}
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">0</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-yellow-100 p-3 rounded-md">
                        <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Pending Reviews
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">0</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'patients' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Registered Patients ({patients.length})
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  List of all patients registered at your MI Room.
                </p>
              </div>
              <ul role="list" className="divide-y divide-gray-200">
                {patients.length === 0 ? (
                  <li className="px-4 py-4 text-center text-gray-500">
                    No patients registered yet.
                  </li>
                ) : (
                  patients.map((patient) => (
                    <li key={patient.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                {patient.name.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {patient.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {patient.age} years • {patient.gender} • {patient.village}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="text-green-600 hover:text-green-900 text-sm font-medium">
                            View Details
                          </button>
                          <button 
                            onClick={() => {
                              // Redirect to external video consultation platform
                              window.open('https://quickconnectfrontend.onrender.com/home', '_blank')
                            }}
                            className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-sm font-medium flex items-center space-x-1"
                          >
                            <span>🎥</span>
                            <span>{getTranslation('videoCall', language) as string}</span>
                          </button>
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}

          {activeTab === 'symptoms' && (
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  AI-Powered Symptom Detection & Analysis
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Enter patient symptoms to get instant AI-powered analysis and treatment recommendations
                </p>
                <div className="mt-6">
                  <SymptomDetectionForm
                    patients={patients}
                    onStartVideoConsultation={(patient) => {
                      setSelectedPatientForConsultation(patient)
                      setShowVideoConsultation(true)
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'register' && (
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Register New Patient
                </h3>
                <div className="mt-6">
                  <PatientRegistrationForm onSuccess={fetchPatients} />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Video Consultation Modal */}
      {showVideoConsultation && selectedPatientForConsultation && (
        <VideoConsultation
          patient={selectedPatientForConsultation}
          consultationId={selectedPatientForConsultation.consultationId}
          onClose={() => {
            setShowVideoConsultation(false)
            setSelectedPatientForConsultation(null)
          }}
        />
      )}
    </div>
  )
}

// Symptom Detection Form Component
function SymptomDetectionForm({ onStartVideoConsultation, patients }: { onStartVideoConsultation: (patient: any) => void, patients: any[] }) {
  const { language } = useLanguage()
  const [selectedPatient, setSelectedPatient] = useState('')
  const [symptoms, setSymptoms] = useState('')
  const [vitalSigns, setVitalSigns] = useState({
    temperature: '',
    bloodPressure: '',
    heartRate: '',
    respiratoryRate: '',
    oxygenSaturation: ''
  })
  const [analysis, setAnalysis] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) {
      alert('Please enter symptoms first')
      return
    }

    setIsAnalyzing(true)
    
    try {
      // Create consultation first
      const consultationResponse = await fetch('/api/consultations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: selectedPatient,
          symptoms,
          vitals: vitalSigns,
          isUrgent: false
        })
      })

      if (consultationResponse.ok) {
        const consultationData = await consultationResponse.json()
        console.log('Consultation created:', consultationData.consultation)
      }

      // Simulate AI analysis delay
      setTimeout(() => {
        const analysisResult = performSymptomAnalysis(symptoms, vitalSigns)
        setAnalysis(analysisResult)
        setIsAnalyzing(false)
      }, 2000)
    } catch (error) {
      console.error('Error creating consultation:', error)
      // Still perform analysis even if consultation creation fails
      setTimeout(() => {
        const analysisResult = performSymptomAnalysis(symptoms, vitalSigns)
        setAnalysis(analysisResult)
        setIsAnalyzing(false)
      }, 2000)
    }
  }

  const performSymptomAnalysis = (symptoms: string, vitals: any) => {
    const symptomText = symptoms.toLowerCase()
    
    // AI-like analysis based on keywords
    let possibleConditions = []
    let urgencyLevel = 'Low'
    let recommendations = []
    let doctorConsultationNeeded = false

    // Emergency symptoms detection
    if (symptomText.includes('chest pain') || symptomText.includes('difficulty breathing') || 
        symptomText.includes('severe headache') || symptomText.includes('unconscious')) {
      urgencyLevel = 'Critical'
      doctorConsultationNeeded = true
      possibleConditions.push('Potential Emergency - Immediate attention required')
      recommendations.push('🚨 Call emergency services immediately')
      recommendations.push('🏥 Transfer to nearest hospital')
    }
    // Heart-related symptoms
    else if (symptomText.includes('chest pain') || symptomText.includes('palpitations') || 
             symptomText.includes('shortness of breath')) {
      urgencyLevel = 'High'
      doctorConsultationNeeded = true
      possibleConditions.push('Possible Cardiac Issue')
      recommendations.push('📞 Immediate doctor consultation required')
      recommendations.push('🩺 ECG recommended')
    }
    // Respiratory symptoms
    else if (symptomText.includes('cough') || symptomText.includes('fever') || 
             symptomText.includes('cold') || symptomText.includes('sore throat')) {
      urgencyLevel = 'Medium'
      possibleConditions.push('Upper Respiratory Tract Infection')
      possibleConditions.push('Common Cold/Flu')
      recommendations.push('💊 Rest and plenty of fluids')
      recommendations.push('🌡️ Monitor temperature')
      if (parseFloat(vitals.temperature) > 101) {
        doctorConsultationNeeded = true
        recommendations.push('📞 Doctor consultation recommended for high fever')
      }
    }
    // Digestive symptoms
    else if (symptomText.includes('stomach pain') || symptomText.includes('nausea') || 
             symptomText.includes('vomiting') || symptomText.includes('diarrhea')) {
      urgencyLevel = 'Medium'
      possibleConditions.push('Gastrointestinal Infection')
      possibleConditions.push('Food Poisoning')
      recommendations.push('💧 Stay hydrated with ORS')
      recommendations.push('🍚 BRAT diet (Banana, Rice, Apple, Toast)')
    }
    // General symptoms
    else if (symptomText.includes('headache') || symptomText.includes('body ache') || 
             symptomText.includes('fatigue')) {
      urgencyLevel = 'Low'
      possibleConditions.push('Viral Infection')
      possibleConditions.push('Stress/Fatigue')
      recommendations.push('😴 Adequate rest')
      recommendations.push('💊 OTC pain relievers if needed')
    }

    // Vital signs analysis
    if (vitals.temperature && parseFloat(vitals.temperature) > 102) {
      urgencyLevel = urgencyLevel === 'Low' ? 'Medium' : 'High'
      doctorConsultationNeeded = true
    }

    if (vitals.bloodPressure) {
      const [systolic] = vitals.bloodPressure.split('/').map(Number)
      if (systolic > 140 || systolic < 90) {
        urgencyLevel = urgencyLevel === 'Low' ? 'Medium' : urgencyLevel
        recommendations.push('🩺 Blood pressure monitoring needed')
      }
    }

    return {
      possibleConditions,
      urgencyLevel,
      recommendations,
      doctorConsultationNeeded,
      confidence: Math.floor(Math.random() * 30) + 70, // Simulated confidence
      estimatedDiagnosis: possibleConditions[0] || 'Requires further examination'
    }
  }

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'Critical': return 'text-red-600 bg-red-100'
      case 'High': return 'text-orange-600 bg-orange-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-green-600 bg-green-100'
    }
  }

  const generateAndDownloadReceipt = () => {
    // Create receipt content
    const currentDate = new Date().toLocaleDateString('en-IN')
    const currentTime = new Date().toLocaleTimeString('en-IN')
    const selectedPatientData = patients.find((p: any) => p.id === selectedPatient)
    
    const receiptContent = `
MI ROOM MEDICAL REPORT
========================

Date: ${currentDate}
Time: ${currentTime}
MI Room Facility ID: MIR-001

PATIENT INFORMATION:
-------------------
Name: ${selectedPatientData?.name || '[Patient Name]'}
Age: ${selectedPatientData?.age || '[Patient Age]'}
Village: ${selectedPatientData?.village || '[Patient Village]'}
Patient ID: ${selectedPatient || '[Patient ID]'}

SYMPTOMS REPORTED:
-----------------
${symptoms || 'No symptoms recorded'}

VITAL SIGNS:
-----------
Blood Pressure: ${vitalSigns.bloodPressure || 'Not recorded'}
Temperature: ${vitalSigns.temperature || 'Not recorded'}°F
Heart Rate: ${vitalSigns.heartRate || 'Not recorded'} bpm
Respiratory Rate: ${vitalSigns.respiratoryRate || 'Not recorded'} per min
Oxygen Saturation: ${vitalSigns.oxygenSaturation || 'Not recorded'}%

${analysis ? `
AI ANALYSIS RESULTS:
-------------------
Urgency Level: ${analysis.urgency}
Risk Assessment: ${analysis.urgency === 'Critical' ? 'HIGH RISK' : analysis.urgency === 'High' ? 'MODERATE RISK' : 'LOW RISK'}

Possible Conditions:
${analysis.possibleConditions.map((condition: string, index: number) => `${index + 1}. ${condition}`).join('\n')}

RECOMMENDATIONS:
---------------
${analysis.recommendations.map((rec: string, index: number) => `${index + 1}. ${rec}`).join('\n')}

${analysis.doctorConsultationNeeded ? 'DOCTOR CONSULTATION: REQUIRED - Immediate specialist referral recommended' : 'DOCTOR CONSULTATION: Not immediately required'}
` : ''}

PRESCRIBED MEDICATIONS:
----------------------
(To be filled by MI Room Incharge based on analysis)

FOLLOW-UP INSTRUCTIONS:
----------------------
- Monitor symptoms for next 24-48 hours
- Return immediately if symptoms worsen
- Take medications as prescribed
- Maintain adequate rest and hydration

NEXT APPOINTMENT:
----------------
Follow-up Date: ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')}
Follow-up Time: 10:00 AM

EMERGENCY CONTACT:
-----------------
MI Room: +91-XXXXXXXXXX
Emergency: 108
Ambulance: 102

========================
This is an AI-assisted analysis report.
Final diagnosis and treatment should be
confirmed by qualified medical personnel.

MI Room Digital Health Initiative
Government of India
Ministry of Health & Family Welfare
    `

    // Create and download the file
    const blob = new Blob([receiptContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `MI_Room_Report_${selectedPatientData?.name.replace(/\s+/g, '_') || 'Patient'}_${currentDate.replace(/\//g, '-')}_${currentTime.replace(/:/g, '-').replace(/\s/g, '')}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    // Show success message
    alert('📋 Medical report downloaded successfully!')
  }

  return (
    <div className="space-y-6">
      {/* Patient Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {getTranslation('selectPatient', language) as string}
        </label>
        <select
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
        >
          <option value="">Choose a patient...</option>
          {patients.map((patient: any) => (
            <option key={patient.id} value={patient.id}>
              {patient.name} - {patient.age}y, {patient.village}
            </option>
          ))}
        </select>
      </div>

      {/* Symptoms Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {getTranslation('symptoms', language) as string} *
        </label>
        <textarea
          rows={4}
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder={getTranslation('enterSymptoms', language) as string}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
        />
      </div>

      {/* Vital Signs */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">{getTranslation('vitalSigns', language) as string}</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">{getTranslation('temperature', language) as string}</label>
            <input
              type="number"
              step="0.1"
              value={vitalSigns.temperature}
              onChange={(e) => setVitalSigns({...vitalSigns, temperature: e.target.value})}
              placeholder="98.6"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{getTranslation('bloodPressure', language) as string}</label>
            <input
              type="text"
              value={vitalSigns.bloodPressure}
              onChange={(e) => setVitalSigns({...vitalSigns, bloodPressure: e.target.value})}
              placeholder="120/80"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{getTranslation('heartRate', language) as string}</label>
            <input
              type="number"
              value={vitalSigns.heartRate}
              onChange={(e) => setVitalSigns({...vitalSigns, heartRate: e.target.value})}
              placeholder="72"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{getTranslation('respiratoryRate', language) as string}</label>
            <input
              type="number"
              value={vitalSigns.respiratoryRate}
              onChange={(e) => setVitalSigns({...vitalSigns, respiratoryRate: e.target.value})}
              placeholder="16"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{getTranslation('oxygenSaturation', language) as string}</label>
            <input
              type="number"
              value={vitalSigns.oxygenSaturation}
              onChange={(e) => setVitalSigns({...vitalSigns, oxygenSaturation: e.target.value})}
              placeholder="98"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>
      </div>

      {/* Analyze Button */}
      <div className="flex justify-center">
        <button
          onClick={analyzeSymptoms}
          disabled={isAnalyzing}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center space-x-2"
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>{getTranslation('analyzing', language) as string}</span>
            </>
          ) : (
            <>
              <span>🔍</span>
              <span>{getTranslation('analyzeSymptoms', language) as string}</span>
            </>
          )}
        </button>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="mt-8 space-y-6">
          <h4 className="text-xl font-bold text-gray-900">🤖 {getTranslation('aiAnalysisResults', language) as string}</h4>
          
          {/* Urgency Level */}
          <div className="bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-lg font-semibold">{getTranslation('urgencyLevel', language) as string}</h5>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(analysis.urgencyLevel)}`}>
                {analysis.urgencyLevel} Priority
              </span>
            </div>
          </div>

          {/* Possible Conditions */}
          <div className="bg-white border rounded-lg p-4">
            <h5 className="text-lg font-semibold mb-3">{getTranslation('possibleConditions', language) as string}</h5>
            <ul className="space-y-2">
              {analysis.possibleConditions.map((condition: string, index: number) => (
                <li key={index} className="flex items-center space-x-2">
                  <span className="text-blue-500">•</span>
                  <span>{condition}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 text-sm text-gray-600">
              Confidence: {analysis.confidence}%
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white border rounded-lg p-4">
            <h5 className="text-lg font-semibold mb-3">{getTranslation('recommendations', language) as string}</h5>
            <ul className="space-y-2">
              {analysis.recommendations.map((rec: string, index: number) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Doctor Consultation */}
          {analysis.doctorConsultationNeeded && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <span className="text-red-600 text-xl">⚠️</span>
                <div>
                  <h5 className="text-lg font-semibold text-red-800">Doctor Consultation Required</h5>
                  <p className="text-red-700">This case requires immediate medical attention from a qualified doctor.</p>
                  <div className="mt-4 flex space-x-3">
                    <button 
                      onClick={() => {
                        // Redirect to external video consultation platform
                        window.open('https://quickconnectfrontend.onrender.com/home', '_blank')
                      }}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium flex items-center space-x-2 shadow-lg transform hover:scale-105 transition-all"
                    >
                      <span>🎥</span>
                      <span>{getTranslation('startVideoConsultation', language) as string}</span>
                    </button>
                    <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium flex items-center space-x-2 shadow-lg">
                      <span>�</span>
                      <span>Text Consultation</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Analysis */}
          <div className="flex justify-end space-x-4">
            {/* <button className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700">
              {getTranslation('saveAnalysis', language) as string}
            </button> */}
            <button 
              onClick={generateAndDownloadReceipt}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
            >
              {getTranslation('printReport', language) as string}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Patient Registration Form Component
function PatientRegistrationForm({ onSuccess }: { onSuccess: () => void }) {
  const { language } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    address: '',
    village: '',
    aadharNumber: '',
    bloodGroup: '',
    allergies: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age)
        }),
      })

      if (response.ok) {
        alert('Patient registered successfully!')
        setFormData({
          name: '',
          age: '',
          gender: '',
          phone: '',
          address: '',
          village: '',
          aadharNumber: '',
          bloodGroup: '',
          allergies: ''
        })
        onSuccess()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to register patient')
      }
    } catch (error) {
      alert('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {getTranslation('patientName', language) as string} *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {getTranslation('age', language) as string} *
          </label>
          <input
            type="number"
            required
            min="0"
            max="120"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {getTranslation('gender', language) as string} *
          </label>
          <select
            required
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          >
            <option value="">{getTranslation('gender', language) as string}</option>
            <option value="Male">{getTranslation('male', language) as string}</option>
            <option value="Female">{getTranslation('female', language) as string}</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Village *
          </label>
          <input
            type="text"
            required
            value={formData.village}
            onChange={(e) => setFormData({ ...formData, village: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Aadhar Number
          </label>
          <input
            type="text"
            value={formData.aadharNumber}
            onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Address *
        </label>
        <textarea
          required
          rows={3}
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Blood Group
          </label>
          <select
            value={formData.bloodGroup}
            onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Known Allergies
          </label>
          <input
            type="text"
            value={formData.allergies}
            onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
            placeholder="e.g., Penicillin, Peanuts"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Registering...' : 'Register Patient'}
        </button>
      </div>
    </form>
  )
}