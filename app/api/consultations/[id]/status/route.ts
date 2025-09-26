import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    const { consultationId, status, notes, diagnosis } = await request.json()

    if (!consultationId || !status) {
      return NextResponse.json({ error: 'Consultation ID and status are required' }, { status: 400 })
    }

    // Update consultation status
    const updatedConsultation = await prisma.consultation.update({
      where: { id: consultationId },
      data: {
        status,
        notes: notes || undefined,
        diagnosis: diagnosis || undefined,
        startedAt: status === 'IN_PROGRESS' ? new Date() : undefined,
        completedAt: status === 'COMPLETED' ? new Date() : undefined,
        doctorId: status === 'IN_PROGRESS' && decoded.role === 'HOSPITAL_DOCTOR' ? decoded.userId : undefined
      },
      include: {
        patient: true,
        miRoom: true,
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

    return NextResponse.json({ 
      success: true, 
      consultation: updatedConsultation 
    })
  } catch (error) {
    console.error('Update consultation status error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}