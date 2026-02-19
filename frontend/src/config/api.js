// API Configuration
// Production backend URL
export const API_BASE_URL = 'https://backend-server-onsc.onrender.com'

// API endpoints
export const API_ENDPOINTS = {
  health: `${API_BASE_URL}/health`,
  signup: `${API_BASE_URL}/auth/signup`,
  signin: `${API_BASE_URL}/auth/signin`,
  me: `${API_BASE_URL}/auth/me`,
  analyze: `${API_BASE_URL}/analyze`,
  assistantChat: `${API_BASE_URL}/assistant/chat`,
  supportedGenes: `${API_BASE_URL}/supported-genes`,
  supportedDrugs: `${API_BASE_URL}/supported-drugs`,
}
