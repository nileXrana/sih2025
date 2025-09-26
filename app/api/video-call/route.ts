import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { eventManager, EVENTS } from '@/lib/events'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    
    // Only hospital doctors can initiate video calls
    if (decoded.role !== 'HOSPITAL_DOCTOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { consultationId, action } = await request.json()

    if (!consultationId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get consultation details
    const consultation = await prisma.consultation.findUnique({
      where: { id: consultationId },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            age: true,
            gender: true,
            village: true
          }
        },
        miRoom: {
          select: {
            id: true,
            name: true,
            village: true
          }
        },
        incharge: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
            specialization: true
          }
        }
      }
    })

    if (!consultation) {
      return NextResponse.json({ error: 'Consultation not found' }, { status: 404 })
    }

    switch (action) {
      case 'initiate':
        // Update consultation to IN_PROGRESS and assign doctor if not already assigned
        await prisma.consultation.update({
          where: { id: consultationId },
          data: {
            status: 'IN_PROGRESS',
            doctorId: decoded.userId,
            startedAt: new Date()
          }
        })

        // Emit event to notify MI Room about incoming video call
        eventManager.emit('video_call_incoming', {
          consultationId,
          consultation,
          doctor: {
            id: decoded.userId,
            name: decoded.name,
            email: decoded.email,
            specialization: 'General Medicine' // Could be fetched from user profile
          },
          timestamp: new Date().toISOString()
        })

        return NextResponse.json({ 
          success: true, 
          message: 'Video call initiated',
          consultation 
        })

      case 'end':
        // Update consultation status
        await prisma.consultation.update({
          where: { id: consultationId },
          data: {
            status: 'COMPLETED',
            completedAt: new Date()
          }
        })

        // Clear WebRTC signaling data
        await fetch('/api/webrtc/signaling', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'clear',
            consultationId
          })
        })

        return NextResponse.json({ 
          success: true, 
          message: 'Video call ended' 
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Video call management error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}