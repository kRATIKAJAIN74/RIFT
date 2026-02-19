import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import ThemeToggle from '../components/ThemeToggle'
import { API_ENDPOINTS } from '../config/api'

const DRUG_OPTIONS = [
	'Codeine',
	'Warfarin',
	'Clopidogrel',
	'Simvastatin',
	'Azathioprine',
	'Fluorouracil',
]

export default function UploadPage() {
	const [file, setFile] = useState(null)
	const [selectedDrugs, setSelectedDrugs] = useState([])
	const [errors, setErrors] = useState([])
	const [submitting, setSubmitting] = useState(false)
	const [results, setResults] = useState(null)
	const [dragActive, setDragActive] = useState(false)
	const [customDrug, setCustomDrug] = useState('')
	const [showAssistant, setShowAssistant] = useState(false)
	const [chatMessages, setChatMessages] = useState([]) // Chat conversation history
	const [chatInput, setChatInput] = useState('') // Current chat input
	const [chatLoading, setChatLoading] = useState(false) // Loading state for chat
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const { user, token, logout } = useAuth()
	const navigate = useNavigate()

	// Load chat from localStorage on mount
	useEffect(() => {
		if (user?.id) {
			const savedChat = localStorage.getItem(`chat_messages_${user.id}`)
			if (savedChat) {
				try {
					setChatMessages(JSON.parse(savedChat))
				} catch (err) {
					console.error('Failed to load chat from storage:', err)
				}
			}
		}
	}, [user?.id])

	// Save chat to localStorage whenever it changes
	useEffect(() => {
		if (user?.id && chatMessages.length > 0) {
			localStorage.setItem(`chat_messages_${user.id}`, JSON.stringify(chatMessages))
		}
	}, [chatMessages, user?.id])

	const handleLogout = () => {
		// Clear chat from localStorage
		if (user?.id) {
			localStorage.removeItem(`chat_messages_${user.id}`)
		}
		logout()
		navigate('/')
	}

	// Assistant chat handlers
	const handleSendMessage = async (message) => {
		if (!message.trim()) return

		// Add user message to chat
		const userMessage = { role: 'user', content: message }
		const updatedMessages = [...chatMessages, userMessage]
		setChatMessages(updatedMessages)
		setChatInput('')
		setChatLoading(true)

		try {
			// Call backend assistant endpoint
			const response = await fetch(API_ENDPOINTS.assistantChat, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({
					message: message,
					conversation_history: chatMessages
				})
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || 'Failed to get assistant response')
			}

			// Add assistant response to chat
			const assistantMessage = { role: 'assistant', content: data.message }
			setChatMessages([...updatedMessages, assistantMessage])
		} catch (err) {
			console.error('Chat error:', err)
			// Add error message
			const errorMessage = { role: 'assistant', content: `Error: ${err.message}` }
			setChatMessages([...updatedMessages, errorMessage])
		} finally {
			setChatLoading(false)
		}
	}

	// Handle quick action buttons
	const handleQuickQuestion = (question) => {
		handleSendMessage(question)
	}

	const validate = () => {
		const errs = []
		if (!file) errs.push('Please upload a VCF file (.vcf, max 5MB).')
		else {
			if (!file.name.toLowerCase().endsWith('.vcf')) errs.push('File must have a .vcf extension.')
			if (file.size > 5 * 1024 * 1024) errs.push('File size exceeds 5MB limit.')
		}
		if (selectedDrugs.length === 0) errs.push('Select at least one drug to analyze.')
		setErrors(errs)
		return errs.length === 0
	}

	const handleFile = (f) => {
		setErrors([])
		setFile(f)
	}

	const onFileChange = (e) => {
		const f = e.target.files?.[0] ?? null
		if (f) handleFile(f)
	}

	const handleDrag = (e) => {
		e.preventDefault()
		e.stopPropagation()
		if (e.type === 'dragenter' || e.type === 'dragover') {
			setDragActive(true)
		} else if (e.type === 'dragleave') {
			setDragActive(false)
		}
	}

	const handleDrop = (e) => {
		e.preventDefault()
		e.stopPropagation()
		setDragActive(false)
		
		if (e.dataTransfer.files?.[0]) {
			handleFile(e.dataTransfer.files[0])
		}
	}

	const onDrugToggle = (drug) => {
		setSelectedDrugs((s) =>
			s.includes(drug) ? s.filter((d) => d !== drug) : [...s, drug],
		)
		setErrors([])
	}

	const handleAddCustomDrug = () => {
		const trimmed = customDrug.trim()
		if (trimmed && !selectedDrugs.includes(trimmed)) {
			setSelectedDrugs([...selectedDrugs, trimmed])
			setCustomDrug('')
			setErrors([])
		}
	}

	const onSubmit = async (e) => {
		e.preventDefault()
		if (!validate()) return
		setSubmitting(true)
		setErrors([])
		setResults(null)
		
		try {
			// Create FormData to send file and drugs
			const formData = new FormData()
			formData.append('file', file)
			formData.append('drug', JSON.stringify(selectedDrugs))
			
			// Call backend API with JWT token
			const response = await fetch(API_ENDPOINTS.analyze, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`
				},
				body: formData,
			})
			
			const data = await response.json()
			
			if (!response.ok) {
				throw new Error(data.error || 'Analysis failed')
			}
			
			// Store results and show success
			setResults(data)
			setFile(null)
			setSelectedDrugs([])
		} catch (err) {
			setErrors([err.message || 'Submission failed — please try again.'])
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<div className="relative w-full">
			{/* Background Video - Full Viewport */}
			<video
				autoPlay
				loop
				muted
				playsInline
				className="fixed inset-0 h-screen w-screen object-cover opacity-80"
				style={{ zIndex: 0 }}
			>
				<source src="/hackathon.mp4" type="video/mp4" />
			</video>

			{/* Content Overlay */}
			<div className="relative z-10 min-h-screen bg-gradient-to-b from-slate-50/80 to-white/80 dark:from-slate-900/90 dark:to-slate-800/90 px-3 sm:px-4 py-6 sm:py-8 backdrop-blur-sm overflow-x-hidden">
				<div className="mx-auto w-full max-w-5xl">
					{/* Top Navigation */}
					<div className="mb-6 sm:mb-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700 p-3 sm:p-4">
						<div className="flex items-center justify-between">
							<Link 
								to="/" 
								className="inline-flex items-center gap-1.5 sm:gap-2 text-slate-700 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
							>
								<svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
								</svg>
								<span className="font-medium text-sm sm:text-base">Back to Home</span>
							</Link>

							{/* Desktop Navigation */}
							<div className="hidden md:flex items-center gap-3 lg:gap-4">
								<ThemeToggle />
								{user && (
									<div className="flex items-center gap-3">
										<div className="px-3 py-2 rounded-lg bg-blue-50 border border-blue-200 text-right dark:bg-blue-900/30 dark:border-blue-700">
											<p className="text-sm font-semibold text-blue-900 dark:text-blue-100 truncate max-w-[150px]">{user.first_name} {user.last_name}</p>
											<p className="text-xs text-blue-700 dark:text-blue-300 truncate max-w-[150px]">{user.email}</p>
										</div>
										<button
											onClick={handleLogout}
											className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-100 transition dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
										>
											Logout
										</button>
									</div>
								)}
							</div>

							{/* Mobile Menu Button */}
							<div className="flex md:hidden items-center gap-2">
								<ThemeToggle />
								<button
									onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
									className="p-1.5 sm:p-2 rounded-lg text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition"
									aria-label="Toggle menu"
								>
									{mobileMenuOpen ? (
										<svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
										</svg>
									) : (
										<svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
										</svg>
									)}
								</button>
							</div>
						</div>

						{/* Mobile Menu */}
						{mobileMenuOpen && user && (
							<div className="md:hidden mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-3">
								<div className="px-3 py-2 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-900/30 dark:border-blue-700">
									<p className="text-sm font-semibold text-blue-900 dark:text-blue-100">{user.first_name} {user.last_name}</p>
									<p className="text-xs text-blue-700 dark:text-blue-300 mt-1">{user.email}</p>
								</div>
								<button
									onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
									className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-100 transition dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 text-center"
								>
									Logout
								</button>
							</div>
						)}
					</div>

					{/* Page Header */}
					<div className="mb-6 sm:mb-8">
						<h1 className="mb-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
							Pharmacogenomic Analysis
						</h1>
						<p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 md:text-lg">
							Upload patient VCF file and select medications for risk assessment
						</p>
					</div>

					{/* Error Messages */}
					{errors.length > 0 && (
						<div className="mb-4 sm:mb-6 rounded-lg border border-red-200 bg-red-50 p-3 sm:p-4 dark:border-red-900/50 dark:bg-red-900/30">
							<ul className="list-disc list-inside text-xs sm:text-sm text-red-700 dark:text-red-300">
								{errors.map((err, i) => (
									<li key={i}>{err}</li>
								))}
							</ul>
						</div>
					)}

					<form onSubmit={onSubmit} className="space-y-6 sm:space-y-8">
					{/* Section 1: Upload VCF File */}
					<div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 md:p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
						<h2 className="mb-4 sm:mb-6 text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">1. Upload VCF File</h2>
						
						<div
							className={`relative rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
								dragActive
									? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
									: 'border-slate-300 bg-slate-50 hover:border-slate-400 dark:border-slate-600 dark:bg-slate-700/50 dark:hover:border-slate-500'
							}`}
							onDragEnter={handleDrag}
							onDragLeave={handleDrag}
							onDragOver={handleDrag}
							onDrop={handleDrop}
						>
							<input
								id="file-upload"
								type="file"
								accept=".vcf"
								onChange={onFileChange}
								className="hidden"
							/>
							
							<div className="flex flex-col items-center gap-4">
								{/* Upload Icon */}
								<svg className="h-16 w-16 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
								</svg>
								
								{file ? (
									<div className="text-center">
										<p className="text-base font-medium text-slate-900 dark:text-white">Selected: {file.name}</p>
										<p className="text-sm text-slate-500 dark:text-slate-400">
											{(file.size / 1024).toFixed(1)} KB
										</p>
									</div>
								) : (
									<div className="text-center">
										<p className="text-base font-medium text-slate-700 dark:text-slate-300">
											Drag and drop your VCF file here
										</p>
										<p className="mt-1 text-sm text-slate-500 dark:text-slate-400">or click to browse</p>
									</div>
								)}
								
								<label
									htmlFor="file-upload"
									className="cursor-pointer rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
								>
									Select File
								</label>
								
								<p className="text-xs text-slate-500">VCF v4.2 format • Max 5 MB</p>
							</div>
						</div>
					</div>

					{/* Section 2: Select Medications */}
					<div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 md:p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
						<h2 className="mb-4 sm:mb-6 text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">2. Select Medications</h2>
						
						<div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
							{DRUG_OPTIONS.map((drug) => (
								<button
									key={drug}
									type="button"
									onClick={() => onDrugToggle(drug)}
									className={`rounded-lg sm:rounded-xl border-2 p-3 sm:p-4 md:p-6 text-center text-xs sm:text-sm md:text-base font-semibold transition-all ${
										selectedDrugs.includes(drug)
											? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm dark:bg-blue-900/30 dark:text-blue-100'
											: 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-700/50 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-600'
									}`}
								>
									{drug.toUpperCase()}
								</button>
							))}
						</div>

						{/* Custom Drug Input */}
						<div className="mt-4 sm:mt-6 flex gap-2">
							<input
								type="text"
								value={customDrug}
								onChange={(e) => setCustomDrug(e.target.value)}
								onKeyPress={(e) => {
									if (e.key === 'Enter') {
										e.preventDefault()
										handleAddCustomDrug()
									}
								}}
								placeholder="Or enter custom drug name..."
								className="flex-1 rounded-lg border border-slate-300 bg-white px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:placeholder:text-slate-500 dark:focus:border-blue-500"
							/>
							<button
								type="button"
								onClick={handleAddCustomDrug}
								className="rounded-lg border border-slate-300 bg-white px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
							>
								Add
							</button>
						</div>
					</div>

					{/* Submit Button */}
					<div className="flex items-center justify-end gap-3">
						<button
							type="submit"
							disabled={submitting}
							className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:shadow-xl hover:shadow-blue-500/40 disabled:cursor-not-allowed disabled:opacity-60 w-full sm:w-auto"
						>
							{submitting ? (
								<>
									<svg className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Analyzing...
								</>
							) : (
								'Start Analysis'
							)}
						</button>
					</div>
				</form>

				{/* Results Section */}
				{results && (
					<div className="mt-8 space-y-6">
						<div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
							<h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Analysis Results</h2>
							<div className="space-y-4">
								{results.analyses?.map((analysis, idx) => (
									<div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-700/50">
										{analysis.error ? (
											<div className="text-red-700 dark:text-red-300">
												<p className="font-semibold">Error analyzing {analysis.drug || 'drug'}</p>
												<p className="text-sm">{analysis.error}</p>
											</div>
										) : (
											<div className="space-y-3">
												<div className="flex items-center justify-between">
													<h3 className="text-lg font-semibold text-slate-900 dark:text-white">{analysis.drug}</h3>
													<span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
														analysis.risk_assessment?.risk_label === 'High Risk' ? 'bg-red-100 text-red-700 border border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700' :
														analysis.risk_assessment?.risk_label === 'Moderate Risk' ? 'bg-yellow-100 text-yellow-700 border border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700' :
														'bg-green-100 text-green-700 border border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700'
													}`}>
														{analysis.risk_assessment?.risk_label || 'Unknown'}
													</span>
												</div>
												
												<div className="space-y-2 text-sm">
													<div className="grid grid-cols-2 gap-2">
														<div>
															<span className="text-slate-600 dark:text-slate-400">Primary Gene:</span>
															<span className="ml-2 text-slate-900 dark:text-white font-medium">{analysis.pharmacogenomic_profile?.primary_gene || 'N/A'}</span>
														</div>
														<div>
															<span className="text-slate-600 dark:text-slate-400">Phenotype:</span>
															<span className="ml-2 text-slate-900 dark:text-white font-medium">{analysis.pharmacogenomic_profile?.phenotype || 'N/A'}</span>
														</div>
													</div>
													
													{analysis.clinical_recommendation && (
														<div className="mt-3 rounded-lg bg-blue-50 border border-blue-200 p-3 dark:bg-blue-900/20 dark:border-blue-700">
															<p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-1">Clinical Recommendation</p>
															<p className="text-sm text-slate-700 dark:text-slate-300">{analysis.clinical_recommendation}</p>
														</div>
													)}
													
													{analysis.llm_explanation && (
														<div className="mt-3 rounded-lg bg-slate-100 border border-slate-200 p-3 dark:bg-slate-700 dark:border-slate-600">
															<p className="text-xs font-semibold text-slate-900 dark:text-white mb-1">AI Explanation</p>
															<p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{analysis.llm_explanation}</p>
														</div>
													)}
												</div>
											</div>
										)}
									</div>
								))}
							</div>
							
							{results.patient_id && (
								<div className="mt-6 text-xs text-slate-500 dark:text-slate-400">
									<p>Patient ID: {results.patient_id}</p>
									<p>Analysis Time: {new Date(results.timestamp).toLocaleString()}</p>
								</div>
							)}
						</div>
					</div>
				)}
				</div>
			</div>

			{/* Floating Ask Assistant Button */}
			<button
				onClick={() => setShowAssistant(!showAssistant)}
				className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 p-3 sm:p-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/40 hover:shadow-xl hover:shadow-blue-500/60 transition-all duration-300 hover:scale-110 flex items-center justify-center group"
				title="Ask Assistant"
			>
				<svg className="h-5 w-5 sm:h-6 sm:w-6 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
				</svg>
			</button>

			{/* Assistant Panel */}
			{showAssistant && (
				<div className="fixed inset-x-4 bottom-20 sm:inset-x-auto sm:bottom-24 sm:right-8 z-50 w-auto sm:w-96 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[70vh] sm:max-h-96">
					{/* Header */}
					<div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0">
						<div className="flex items-center gap-2">
							<div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 flex items-center justify-center">
								<svg className="h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
								</svg>
							</div>
							<h3 className="text-white font-semibold text-sm sm:text-base">PharmaGuard Assistant</h3>
						</div>
						<button
							onClick={() => {
								setShowAssistant(false)
							}}
							className="text-white/80 hover:text-white transition"
						>
							<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>

					{/* Chat Messages Area */}
					<div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3 bg-slate-50 dark:bg-slate-700/30 scrollbar-styled">
						{chatMessages.length === 0 ? (
							<div className="text-center text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
								<p className="mb-2 sm:mb-3">👋 Hello! How can I help you today?</p>
								<div className="space-y-1.5 sm:space-y-2">
									<button
										onClick={() => handleQuickQuestion('How do I upload a VCF file?')}
										className="w-full text-left px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium transition dark:bg-blue-900/20 dark:hover:bg-blue-900/40 dark:text-blue-300"
									>
										💊 Upload VCF file
									</button>
									<button
										onClick={() => handleQuickQuestion('What is pharmacogenomics and how does the analysis work?')}
										className="w-full text-left px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-medium transition dark:bg-purple-900/20 dark:hover:bg-purple-900/40 dark:text-purple-300"
									>
										🧬 How it works
									</button>
									<button
										onClick={() => handleQuickQuestion('What do the different risk levels mean?')}
										className="w-full text-left px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium transition dark:bg-green-900/20 dark:hover:bg-green-900/40 dark:text-green-300"
									>
										⚠️ Risk levels
									</button>
								</div>
							</div>
						) : (
							chatMessages.map((msg, idx) => (
								<div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
									<div className={`max-w-[85%] sm:max-w-xs rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm ${
										msg.role === 'user'
											? 'bg-blue-600 text-white'
											: 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-500'
									}`}>
										{msg.content}
									</div>
								</div>
							))
						)}
						{chatLoading && (
							<div className="flex justify-start">
								<div className="bg-white dark:bg-slate-600 text-slate-500 dark:text-slate-300 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm">
									<span className="animate-pulse">Thinking...</span>
								</div>
							</div>
						)}
						{chatMessages.length > 0 && !chatLoading && (
							<div className="flex justify-center pt-1 sm:pt-2">
								<button
									onClick={() => setChatMessages([])}
									className="text-xs text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition"
								>
									Clear chat
								</button>
							</div>
						)}
					</div>

					{/* Input Area */}
					<div className="border-t border-slate-200 dark:border-slate-700 px-3 sm:px-4 py-2 sm:py-3 bg-white dark:bg-slate-800 flex-shrink-0">
						<div className="flex gap-1.5 sm:gap-2">
							<input
								type="text"
								value={chatInput}
								onChange={(e) => setChatInput(e.target.value)}
								onKeyPress={(e) => {
									if (e.key === 'Enter' && !chatLoading) {
										handleSendMessage(chatInput)
									}
								}}
								placeholder="Ask anything..."
								disabled={chatLoading}
								className="flex-1 px-2.5 sm:px-3 py-1.5 sm:py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400"
							/>
							<button
								onClick={() => handleSendMessage(chatInput)}
								disabled={!chatInput.trim() || chatLoading}
								className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg text-xs sm:text-sm font-medium transition disabled:cursor-not-allowed"
							>
								<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
								</svg>
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

