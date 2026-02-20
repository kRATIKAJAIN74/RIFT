import { createContext, useContext, useState, useEffect } from 'react'
import { API_BASE_URL } from '../config/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)
	const [token, setToken] = useState(localStorage.getItem('token'))

	// Check if user is logged in on mount
	useEffect(() => {
		const storedToken = localStorage.getItem('token')
		if (storedToken) {
			setToken(storedToken)
			verifyToken(storedToken)
		} else {
			setLoading(false)
		}
	}, [])

	const verifyToken = async (accessToken) => {
		try {
			console.log('Verifying token...')
			const response = await fetch(`${API_BASE_URL}/auth/me`, {
				headers: {
					'Authorization': `Bearer ${accessToken}`
				}
			})
			const data = await response.json()
			console.log('Token verification response:', response.status, data)
			if (response.ok && data.user) {
				setUser(data.user)
			} else {
				console.warn('Token verification failed, clearing auth')
				localStorage.removeItem('token')
				setToken(null)
			}
		} catch (err) {
			console.error('Token verification exception:', err)
			localStorage.removeItem('token')
			setToken(null)
		} finally {
			setLoading(false)
		}
	}

	const signup = async (email, password, firstName, lastName) => {
		try {
			const payload = {
				email,
				password,
				first_name: firstName,
				last_name: lastName
			}
			console.log('Sending signup request:', payload)
			
			const response = await fetch(`${API_BASE_URL}/auth/signup`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			})
			
			const data = await response.json()
			console.log('Signup response:', response.status, data)
			
			if (response.ok && data.access_token && data.user) {
				localStorage.setItem('token', data.access_token)
				setToken(data.access_token)
				setUser(data.user)
				return { success: true }
			} else {
				const error = data.error || 'Signup failed'
				console.error('Signup error:', error)
				return { success: false, error }
			}
		} catch (err) {
			console.error('Signup exception:', err)
			return { success: false, error: err.message || 'Network error. Make sure backend is running.' }
		}
	}

	const signin = async (email, password) => {
		try {
			const payload = { email, password }
			console.log('Sending signin request:', { email })
			
			const response = await fetch(`${API_BASE_URL}/auth/signin`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			})
			
			const data = await response.json()
			console.log('Signin response:', response.status, data)
			
			if (response.ok && data.access_token && data.user) {
				localStorage.setItem('token', data.access_token)
				setToken(data.access_token)
				setUser(data.user)
				return { success: true }
			} else {
				const error = data.error || 'Login failed'
				console.error('Signin error:', error)
				return { success: false, error }
			}
		} catch (err) {
			console.error('Signin exception:', err)
			return { success: false, error: err.message || 'Network error. Make sure backend is running.' }
		}
	}

	const logout = () => {
		localStorage.removeItem('token')
		setToken(null)
		setUser(null)
	}

	return (
		<AuthContext.Provider value={{ user, token, loading, signup, signin, logout }}>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('useAuth must be used within AuthProvider')
	}
	return context
}
