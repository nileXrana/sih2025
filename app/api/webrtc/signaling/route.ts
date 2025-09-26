import { NextRequest, NextResponse } from 'next/server'

// In-memory store for WebRTC signaling (in production, use Redis or similar)
const signalingData = new Map<string, any>()

export async function POST(request: NextRequest) {
  try {
    const { type, consultationId, data } = await request.json()

    if (!consultationId) {
      return NextResponse.json({ error: 'Consultation ID required' }, { status: 400 })
    }

    switch (type) {
      case 'offer':
        signalingData.set(`${consultationId}_offer`, data)
        return NextResponse.json({ success: true })
      
      case 'answer':
        signalingData.set(`${consultationId}_answer`, data)
        return NextResponse.json({ success: true })
      
      case 'ice-candidate':
        const candidates = signalingData.get(`${consultationId}_candidates`) || []
        candidates.push(data)
        signalingData.set(`${consultationId}_candidates`, candidates)
        return NextResponse.json({ success: true })
      
      case 'get-offer':
        const offer = signalingData.get(`${consultationId}_offer`)
        return NextResponse.json({ offer })
      
      case 'get-answer':
        const answer = signalingData.get(`${consultationId}_answer`)
        return NextResponse.json({ answer })
      
      case 'get-candidates':
        const iceCandidates = signalingData.get(`${consultationId}_candidates`) || []
        return NextResponse.json({ candidates: iceCandidates })
      
      case 'clear':
        signalingData.delete(`${consultationId}_offer`)
        signalingData.delete(`${consultationId}_answer`)
        signalingData.delete(`${consultationId}_candidates`)
        return NextResponse.json({ success: true })
      
      default:
        return NextResponse.json({ error: 'Invalid signaling type' }, { status: 400 })
    }
  } catch (error) {
    console.error('Signaling error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const consultationId = searchParams.get('consultationId')
  const type = searchParams.get('type')

  if (!consultationId || !type) {
    return NextResponse.json({ error: 'Consultation ID and type required' }, { status: 400 })
  }

  try {
    switch (type) {
      case 'offer':
        const offer = signalingData.get(`${consultationId}_offer`)
        return NextResponse.json({ offer })
      
      case 'answer':
        const answer = signalingData.get(`${consultationId}_answer`)
        return NextResponse.json({ answer })
      
      case 'candidates':
        const candidates = signalingData.get(`${consultationId}_candidates`) || []
        return NextResponse.json({ candidates })
      
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }
  } catch (error) {
    console.error('Get signaling data error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
