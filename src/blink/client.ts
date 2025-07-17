import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: 'aurasell-b2b-platform-nb7skn27',
  authRequired: true
})

// Add error handling for network issues
const originalFetch = window.fetch
window.fetch = async (...args) => {
  try {
    return await originalFetch(...args)
  } catch (error) {
    console.warn('Network request failed, continuing with offline mode:', error)
    // Return a mock response for failed requests to prevent app crashes
    return new Response(JSON.stringify({ error: 'Network unavailable' }), {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export default blink