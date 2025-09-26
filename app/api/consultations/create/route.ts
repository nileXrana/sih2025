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
    
    // Only MI Room Incharges can create consultations
    if (decoded.role !== 'MI_ROOM_INCHARGE') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const {
      patientId,
      symptoms,
      vitals,
      isUrgent = false
    } = await request.json()

    if (!patientId || !symptoms) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create consultation
    const consultation = await prisma.consultation.create({
      data: {
        patientId,
        symptoms,
        vitals: vitals || null,
        isUrgent,
        miRoomId: decoded.miRoomId,
        inchargeId: decoded.userId,
        status: 'PENDING'
      },
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
            name: true
          }
        }
      }
    })

    // Emit event for real-time notifications
    const eventType = isUrgent ? EVENTS.URGENT_CONSULTATION : EVENTS.NEW_CONSULTATION
    eventManager.emit(eventType, {
      consultation,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({ 
      message: 'Consultation created successfully',
      consultation 
    })
  } catch (error) {
    console.error('Create consultation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
