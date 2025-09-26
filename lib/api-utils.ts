/**
 * Safely parse JSON response from fetch, with proper error handling
 */
export async function safeJsonResponse(response: Response): Promise<any> {
  const contentType = response.headers.get('content-type')
  
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text()
    console.warn('Expected JSON response but got:', contentType, 'Content:', text.slice(0, 200))
    throw new Error(`Invalid response format: ${contentType}`)
  }
  
  try {
    return await response.json()
  } catch (error) {
    console.error('Failed to parse JSON response:', error)
    throw new Error('Invalid JSON response')
  }
}

/**
 * Wrapper for fetch with better error handling for JSON APIs
 */
export async function fetchJson(url: string, options?: RequestInit): Promise<any> {
  try {
    const response = await fetch(url, options)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await safeJsonResponse(response)
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error)
    throw error
  }
}