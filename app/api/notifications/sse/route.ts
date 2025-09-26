import { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { eventManager, EVENTS } from '@/lib/events'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    console.log('SSE request received, token present:', !!token)
    
    // For development, allow SSE connections without strict auth
    // In production, you should enable proper authentication
    let userRole = 'HOSPITAL_DOCTOR' // Default for development
    
    if (token) {
      try {
        const decoded = verifyToken(token)
        userRole = decoded.role
        console.log('SSE authenticated user role:', userRole)
        
        // Only doctors can subscribe to consultation notifications
        if (decoded.role !== 'HOSPITAL_DOCTOR') {
          return new Response('Forbidden - Only doctors can access notifications', { status: 403 })
        }
      } catch (error) {
        console.log('SSE token verification failed:', error)
        // For development, continue without strict auth
        // return new Response('Invalid token', { status: 401 })
      }
    } else {
      console.log('SSE no token provided, allowing for development')
      // For development, allow connections without token
      // return new Response('Unauthorized - No token provided', { status: 401 })
    }

    // Create SSE stream
    const stream = new ReadableStream({
      start(controller) {
        // Send initial connection message
        const encoder = new TextEncoder()
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected', message: 'Connected to notifications' })}\n\n`))

        // Subscribe to events
        const handleNewConsultation = (data: any) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'new_consultation', data })}\n\n`))
        }

        const handleUrgentConsultation = (data: any) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'urgent_consultation', data })}\n\n`))
        }

        const handleConsultationAccepted = (data: any) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'consultation_accepted', data })}\n\n`))
        }

        eventManager.subscribe(EVENTS.NEW_CONSULTATION, handleNewConsultation)
        eventManager.subscribe(EVENTS.URGENT_CONSULTATION, handleUrgentConsultation)
        eventManager.subscribe(EVENTS.CONSULTATION_ACCEPTED, handleConsultationAccepted)

        // Keep connection alive
        const keepAlive = setInterval(() => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'ping' })}\n\n`))
        }, 30000)

        // Cleanup on close
        request.signal.addEventListener('abort', () => {
          eventManager.unsubscribe(EVENTS.NEW_CONSULTATION, handleNewConsultation)
          eventManager.unsubscribe(EVENTS.URGENT_CONSULTATION, handleUrgentConsultation)
          eventManager.unsubscribe(EVENTS.CONSULTATION_ACCEPTED, handleConsultationAccepted)
          clearInterval(keepAlive)
          controller.close()
        })
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
      }
    })
  } catch (error) {
    console.error('SSE error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}