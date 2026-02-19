import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function SignupPage() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [errors, setErrors] = useState([])
	const [submitting, setSubmitting] = useState(false)
	const { signup } = useAuth()
	const navigate = useNavigate()

	const validate = () => {
		const errs = []
		if (!email) errs.push('Email is required')
		else if (!email.includes('@')) errs.push('Please enter a valid email')
		if (!firstName) errs.push('First name is required')
		if (!lastName) errs.push('Last name is required')
		if (!password) errs.push('Password is required')
		else if (password.length < 6) errs.push('Password must be at least 6 characters')
		if (password !== confirmPassword) errs.push('Passwords do not match')
		setErrors(errs)
		return errs.length === 0
	}

	const onSubmit = async (e) => {
		e.preventDefault()
		if (!validate()) return
		setSubmitting(true)
		setErrors([])

		const result = await signup(email, password, firstName, lastName)
		if (result.success) {
			navigate('/upload')
		} else {
			setErrors([result.error || 'Signup failed'])
		}
		setSubmitting(false)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-8">
			<div className="w-full max-w-md">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="flex justify-center mb-4">
						<div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
							<svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
							</svg>
						</div>
					</div>
					<h1 className="text-3xl font-bold text-slate-900 mb-2">PharmaGuard</h1>
					<p className="text-slate-600">Create your account</p>
				</div>

				{/* Card */}
				<div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
					{/* Error Messages */}
					{errors.length > 0 && (
						<div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
							<ul className="list-disc list-inside text-sm text-red-700">
								{errors.map((err, i) => (
									<li key={i}>{err}</li>
								))}
							</ul>
						</div>
					)}

					<form onSubmit={onSubmit} className="space-y-4">
						{/* First Name */}
						<div>
							<label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">
								First Name
							</label>
							<input
								id="firstName"
								type="text"
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
								className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="John"
								disabled={submitting}
							/>
						</div>

						{/* Last Name */}
						<div>
							<label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">
								Last Name
							</label>
							<input
								id="lastName"
								type="text"
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
								className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Doe"
								disabled={submitting}
							/>
						</div>

						{/* Email */}
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
								Email Address
							</label>
							<input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="you@example.com"
								disabled={submitting}
							/>
						</div>

						{/* Password */}
						<div>
							<label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
								Password
							</label>
							<input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="••••••••"
								disabled={submitting}
							/>
						</div>

						{/* Confirm Password */}
						<div>
							<label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
								Confirm Password
							</label>
							<input
								id="confirmPassword"
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="••••••••"
								disabled={submitting}
							/>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={submitting}
							className="w-full mt-6 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{submitting ? 'Creating account...' : 'Sign Up'}
						</button>
					</form>

					{/* Divider */}
					<div className="my-6 flex items-center">
						<div className="flex-1 border-t border-slate-300"></div>
						<span className="px-3 text-sm text-slate-500">or</span>
						<div className="flex-1 border-t border-slate-300"></div>
					</div>

					{/* Sign In Link */}
					<p className="text-center text-slate-600">
						Already have an account?{' '}
						<Link to="/signin" className="text-blue-600 font-semibold hover:text-blue-700">
							Sign In
						</Link>
					</p>
				</div>
			</div>
		</div>
	)
}
