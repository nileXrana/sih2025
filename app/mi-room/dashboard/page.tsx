'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import VideoConsultation from '@/components/VideoConsultation'

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
  const [user, setUser] = useState<User | null>(null)
  const [patients, setPatients] = useState<Patient[]>([])
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [showVideoConsultation, setShowVideoConsultation] = useState(false)
  const [selectedPatientForConsultation, setSelectedPatientForConsultation] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Prototype mode - no authentication required
    setUser({
      id: '1',
      name: 'MI Room Incharge',
      email: 'incharge@miroom.com',
      role: 'MI_ROOM_INCHARGE'
    })
    fetchPatients()
    setLoading(false)
  }, [])

  const fetchPatients = async () => {
    // Prototype mode - use mock data
    const mockPatients = [
      {
        id: '1',
        name: 'Rajesh Kumar',
        age: 45,
        gender: 'Male',
        phone: '+91-9876543210',
        village: 'Khanna',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Sunita Devi',
        age: 32,
        gender: 'Female',
        phone: '+91-9876543211',
        village: 'Nabha',
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Amarjit Singh',
        age: 58,
        gender: 'Male',
        phone: '+91-9876543212',
        village: 'Ludhiana',
        createdAt: new Date().toISOString()
      }
    ]
    setPatients(mockPatients)
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
                <h1 className="text-2xl font-bold text-gray-900">MI Room Dashboard</h1>
                <p className="text-gray-600">Welcome, {user?.name}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: '📊' },
              { id: 'patients', name: 'Patients', icon: '👥' },
              { id: 'symptoms', name: 'Symptom Detection', icon: '🔍' },
              { id: 'consultations', name: 'Consultations', icon: '🩺' },
              { id: 'register', name: 'Register Patient', icon: '➕' }
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
                          Total Patients
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
                          Today's Consultations
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
                  Registered Patients
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
                              setSelectedPatientForConsultation({
                                ...patient,
                                symptoms: 'General consultation requested',
                                urgency: 'Medium'
                              })
                              setShowVideoConsultation(true)
                            }}
                            className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-sm font-medium flex items-center space-x-1"
                          >
                            <span>🎥</span>
                            <span>Video Call</span>
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
function SymptomDetectionForm({ onStartVideoConsultation }: { onStartVideoConsultation: (patient: any) => void }) {
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
  const [patientsList] = useState([
    { id: '1', name: 'Rajesh Kumar', age: 45, village: 'Khanna' },
    { id: '2', name: 'Sunita Devi', age: 32, village: 'Nabha' },
    { id: '3', name: 'Amarjit Singh', age: 58, village: 'Ludhiana' }
  ])

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) {
      alert('Please enter symptoms first')
      return
    }

    setIsAnalyzing(true)
    
    // Simulate AI analysis delay
    setTimeout(() => {
      const analysisResult = performSymptomAnalysis(symptoms, vitalSigns)
      setAnalysis(analysisResult)
      setIsAnalyzing(false)
    }, 2000)
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
    const selectedPatientData = patientsList.find(p => p.id === selectedPatient)
    
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
          Select Patient
        </label>
        <select
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
        >
          <option value="">Choose a patient...</option>
          {patientsList.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.name} - {patient.age}y, {patient.village}
            </option>
          ))}
        </select>
      </div>

      {/* Symptoms Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Describe Symptoms *
        </label>
        <textarea
          rows={4}
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="e.g., Patient complains of fever, cough, and body ache for 2 days..."
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
        />
      </div>

      {/* Vital Signs */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">Vital Signs</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Temperature (°F)</label>
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
            <label className="block text-sm font-medium text-gray-700">Blood Pressure</label>
            <input
              type="text"
              value={vitalSigns.bloodPressure}
              onChange={(e) => setVitalSigns({...vitalSigns, bloodPressure: e.target.value})}
              placeholder="120/80"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Heart Rate (bpm)</label>
            <input
              type="number"
              value={vitalSigns.heartRate}
              onChange={(e) => setVitalSigns({...vitalSigns, heartRate: e.target.value})}
              placeholder="72"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Respiratory Rate</label>
            <input
              type="number"
              value={vitalSigns.respiratoryRate}
              onChange={(e) => setVitalSigns({...vitalSigns, respiratoryRate: e.target.value})}
              placeholder="16"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Oxygen Saturation (%)</label>
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
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <span>🔍</span>
              <span>Analyze Symptoms</span>
            </>
          )}
        </button>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="mt-8 space-y-6">
          <h4 className="text-xl font-bold text-gray-900">🤖 AI Analysis Results</h4>
          
          {/* Urgency Level */}
          <div className="bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-lg font-semibold">Urgency Level</h5>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(analysis.urgencyLevel)}`}>
                {analysis.urgencyLevel} Priority
              </span>
            </div>
          </div>

          {/* Possible Conditions */}
          <div className="bg-white border rounded-lg p-4">
            <h5 className="text-lg font-semibold mb-3">Possible Conditions</h5>
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
            <h5 className="text-lg font-semibold mb-3">Treatment Recommendations</h5>
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
                        const selectedPatientData = patientsList.find(p => p.id === selectedPatient)
                        if (selectedPatientData) {
                          onStartVideoConsultation({
                            ...selectedPatientData,
                            symptoms,
                            urgency: analysis.urgencyLevel
                          })
                        }
                      }}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium flex items-center space-x-2 shadow-lg transform hover:scale-105 transition-all"
                    >
                      <span>🎥</span>
                      <span>Start Video Consultation</span>
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
              💾 Save Analysis
            </button> */}
            <button 
              onClick={generateAndDownloadReceipt}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
            >
              📋 Print Report
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Patient Registration Form Component
function PatientRegistrationForm({ onSuccess }: { onSuccess: () => void }) {
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
            Full Name *
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
            Age *
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
            Gender *
          </label>
          <select
            required
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
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