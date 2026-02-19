import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children }) {
	const { user, loading } = useAuth()

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
				<div className="text-center">
					<div className="w-12 h-12 border-4 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-slate-600">Loading...</p>
				</div>
			</div>
		)
	}

	if (!user) {
		return <Navigate to="/signin" replace />
	}

	return children
}
