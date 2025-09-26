import { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { eventManager } from '@/lib/events'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    console.log('MI Room SSE request received, token present:', !!token)
    
    // For development, allow SSE connections with less strict auth
    let userRole = 'MI_ROOM_INCHARGE' // Default for development
    
    if (token) {
      try {
        const decoded = verifyToken(token)
        userRole = decoded.role
        console.log('MI Room SSE authenticated user role:', userRole)
        
        // Only MI Room Incharges can subscribe to video call notifications
        if (decoded.role !== 'MI_ROOM_INCHARGE') {
          return new Response('Forbidden - Only MI Room Incharges can access notifications', { status: 403 })
        }
      } catch (error) {
        console.log('MI Room SSE token verification failed:', error)
        // For development, continue without strict auth
      }
    } else {
      console.log('MI Room SSE no token provided, allowing for development')
    }

    // Create SSE stream
    const stream = new ReadableStream({
      start(controller) {
        // Send initial connection message
        const encoder = new TextEncoder()
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected', message: 'Connected to MI Room notifications' })}\n\n`))

        // Subscribe to video call events
        const handleIncomingVideoCall = (data: any) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'video_call_incoming', data })}\n\n`))
        }

        const handleVideoCallEnded = (data: any) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'video_call_ended', data })}\n\n`))
        }

        eventManager.subscribe('video_call_incoming', handleIncomingVideoCall)
        eventManager.subscribe('video_call_ended', handleVideoCallEnded)

        // Keep connection alive
        const keepAlive = setInterval(() => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'ping' })}\n\n`))
        }, 30000)

        // Cleanup on close
        request.signal.addEventListener('abort', () => {
          eventManager.unsubscribe('video_call_incoming', handleIncomingVideoCall)
          eventManager.unsubscribe('video_call_ended', handleVideoCallEnded)
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
    console.error('MI Room SSE error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}