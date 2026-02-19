import { useState } from 'react'
import { Link } from 'react-router-dom'

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
			
			// Call backend API
			const response = await fetch('http://localhost:5000/analyze', {
				method: 'POST',
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
			<div className="relative z-10 min-h-screen bg-gradient-to-b from-slate-50/80 to-white/80 px-4 py-8 backdrop-blur-sm overflow-x-hidden">
				<div className="mx-auto w-full max-w-5xl">
					{/* Back to Home Button */}
					<Link 
						to="/" 
						className="mb-8 inline-flex items-center gap-2 text-slate-700 transition hover:text-slate-900"
					>
						<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
						</svg>
						<span className="font-medium">Back to Home</span>
					</Link>

					{/* Page Header */}
					<div className="mb-8">
						<h1 className="mb-2 text-3xl font-bold text-slate-900 md:text-4xl">
							Pharmacogenomic Analysis
						</h1>
						<p className="text-base text-slate-600 md:text-lg">
							Upload patient VCF file and select medications for risk assessment
						</p>
					</div>

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

					<form onSubmit={onSubmit} className="space-y-8">
					{/* Section 1: Upload VCF File */}
					<div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
						<h2 className="mb-6 text-xl font-semibold text-slate-900">1. Upload VCF File</h2>
						
						<div
							className={`relative rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
								dragActive
									? 'border-blue-500 bg-blue-50'
									: 'border-slate-300 bg-slate-50 hover:border-slate-400'
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
								<svg className="h-16 w-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
								</svg>
								
								{file ? (
									<div className="text-center">
										<p className="text-base font-medium text-slate-900">Selected: {file.name}</p>
										<p className="text-sm text-slate-500">
											{(file.size / 1024).toFixed(1)} KB
										</p>
									</div>
								) : (
									<div className="text-center">
										<p className="text-base font-medium text-slate-700">
											Drag and drop your VCF file here
										</p>
										<p className="mt-1 text-sm text-slate-500">or click to browse</p>
									</div>
								)}
								
								<label
									htmlFor="file-upload"
									className="cursor-pointer rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
								>
									Select File
								</label>
								
								<p className="text-xs text-slate-500">VCF v4.2 format • Max 5 MB</p>
							</div>
						</div>
					</div>

					{/* Section 2: Select Medications */}
					<div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
						<h2 className="mb-6 text-xl font-semibold text-slate-900">2. Select Medications</h2>
						
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{DRUG_OPTIONS.map((drug) => (
								<button
									key={drug}
									type="button"
									onClick={() => onDrugToggle(drug)}
									className={`rounded-xl border-2 p-6 text-center text-base font-semibold transition-all ${
										selectedDrugs.includes(drug)
											? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
											: 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
									}`}
								>
									{drug.toUpperCase()}
								</button>
							))}
						</div>

						{/* Custom Drug Input */}
						<div className="mt-6 flex gap-2">
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
								className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
							/>
							<button
								type="button"
								onClick={handleAddCustomDrug}
								className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
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
							className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:shadow-xl hover:shadow-blue-500/40 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{submitting ? (
								<>
									<svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
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
						<div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
							<h2 className="mb-6 text-2xl font-bold text-slate-900">Analysis Results</h2>
							<div className="space-y-4">
								{results.analyses?.map((analysis, idx) => (
									<div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-6">
										{analysis.error ? (
											<div className="text-red-700">
												<p className="font-semibold">Error analyzing {analysis.drug || 'drug'}</p>
												<p className="text-sm">{analysis.error}</p>
											</div>
										) : (
											<div className="space-y-3">
												<div className="flex items-center justify-between">
													<h3 className="text-lg font-semibold text-slate-900">{analysis.drug}</h3>
													<span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
														analysis.risk_assessment?.risk_label === 'High Risk' ? 'bg-red-100 text-red-700 border border-red-300' :
														analysis.risk_assessment?.risk_label === 'Moderate Risk' ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' :
														'bg-green-100 text-green-700 border border-green-300'
													}`}>
														{analysis.risk_assessment?.risk_label || 'Unknown'}
													</span>
												</div>
												
												<div className="space-y-2 text-sm">
													<div className="grid grid-cols-2 gap-2">
														<div>
															<span className="text-slate-600">Primary Gene:</span>
															<span className="ml-2 text-slate-900 font-medium">{analysis.pharmacogenomic_profile?.primary_gene || 'N/A'}</span>
														</div>
														<div>
															<span className="text-slate-600">Phenotype:</span>
															<span className="ml-2 text-slate-900 font-medium">{analysis.pharmacogenomic_profile?.phenotype || 'N/A'}</span>
														</div>
													</div>
													
													{analysis.clinical_recommendation && (
														<div className="mt-3 rounded-lg bg-blue-50 border border-blue-200 p-3">
															<p className="text-xs font-semibold text-blue-900 mb-1">Clinical Recommendation</p>
															<p className="text-sm text-slate-700">{analysis.clinical_recommendation}</p>
														</div>
													)}
													
													{analysis.llm_explanation && (
														<div className="mt-3 rounded-lg bg-slate-100 border border-slate-200 p-3">
															<p className="text-xs font-semibold text-slate-900 mb-1">AI Explanation</p>
															<p className="text-sm text-slate-700 whitespace-pre-wrap">{analysis.llm_explanation}</p>
														</div>
													)}
												</div>
											</div>
										)}
									</div>
								))}
							</div>
							
							{results.patient_id && (
								<div className="mt-6 text-xs text-slate-500">
									<p>Patient ID: {results.patient_id}</p>
									<p>Analysis Time: {new Date(results.timestamp).toLocaleString()}</p>
								</div>
							)}
						</div>
					</div>
				)}
				</div>
			</div>
		</div>
	)
}

