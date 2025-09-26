// Simple in-memory event system for real-time notifications
type EventCallback = (data: any) => void

class EventManager {
  private events: Map<string, EventCallback[]> = new Map()

  subscribe(event: string, callback: EventCallback) {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }
    this.events.get(event)!.push(callback)
  }

  unsubscribe(event: string, callback: EventCallback) {
    const callbacks = this.events.get(event)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  emit(event: string, data: any) {
    const callbacks = this.events.get(event)
    if (callbacks) {
      callbacks.forEach(callback => callback(data))
    }
  }

  clear() {
    this.events.clear()
  }
}

export const eventManager = new EventManager()

// Event types
export const EVENTS = {
  NEW_CONSULTATION: 'new_consultation',
  CONSULTATION_ACCEPTED: 'consultation_accepted',
  CONSULTATION_COMPLETED: 'consultation_completed',
  URGENT_CONSULTATION: 'urgent_consultation'
} as const