import { useState } from 'react'
import { Link } from 'react-router-dom'

const DRUG_OPTIONS = [
	'Warfarin',
	'Clopidogrel',
	'Simvastatin',
	'Codeine',
	'Thiopurines',
]

export default function UploadPage() {
	const [file, setFile] = useState(null)
	const [selectedDrugs, setSelectedDrugs] = useState([])
	const [errors, setErrors] = useState([])
	const [submitting, setSubmitting] = useState(false)

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

	const onFileChange = (e) => {
		setErrors([])
		const f = e.target.files?.[0] ?? null
		setFile(f)
	}

	const onDrugToggle = (drug) => {
		setSelectedDrugs((s) =>
			s.includes(drug) ? s.filter((d) => d !== drug) : [...s, drug],
		)
		setErrors([])
	}

	const onSubmit = async (e) => {
		e.preventDefault()
		if (!validate()) return
		setSubmitting(true)
		try {
			// Placeholder: replace with real upload endpoint
			await new Promise((r) => setTimeout(r, 900))
			alert('File validated and submitted for analysis.')
			setFile(null)
			setSelectedDrugs([])
			setErrors([])
		} catch (err) {
			setErrors(['Submission failed — please try again.'])
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<div className="relative min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
			<div className="absolute inset-0 -z-10 overflow-hidden">
				<div className="absolute left-[-140px] top-[-140px] h-[360px] w-[360px] rounded-full bg-sky-500/20 blur-3xl" />
				<div className="absolute bottom-[-180px] right-[-120px] h-[420px] w-[420px] rounded-full bg-indigo-500/20 blur-3xl" />
			</div>

			<div className="mx-auto w-full max-w-3xl">
				<div className="mb-6 flex items-center justify-between">
					<Link to="/" className="inline-flex items-center rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-sky-300/60 hover:text-sky-200">
						← Back to Home
					</Link>
					<span className="rounded-full border border-sky-300/40 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-200">
						Secure Upload
					</span>
				</div>

				<div className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl">
					<h1 className="mb-3 text-2xl font-semibold text-white md:text-3xl">
						Pharmacogenomic Risk Analysis
					</h1>
					<p className="mb-6 text-sm text-slate-300 md:text-base">
						Upload a VCF file and select drugs to generate CPIC-aligned risk predictions.
					</p>

					{errors.length > 0 && (
						<div className="mb-4 rounded-xl border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-100">
							<ul className="list-disc list-inside">
								{errors.map((err, i) => (
									<li key={i}>{err}</li>
								))}
							</ul>
						</div>
					)}

					<form onSubmit={onSubmit} className="space-y-6">
						<div>
							<label className="block text-sm font-medium text-slate-200">VCF File</label>
							<div className="mt-2 rounded-xl border border-white/10 bg-slate-900/50 p-3">
								<input
									type="file"
									accept=".vcf"
									onChange={onFileChange}
									className="w-full rounded-md border border-white/15 bg-slate-900 px-3 py-2 text-sm text-slate-200 file:mr-4 file:rounded-full file:border-0 file:bg-sky-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-sky-400"
								/>
								<p className="mt-2 text-xs text-slate-400">Accepted: .vcf — Max 5MB</p>
								{file && (
									<p className="mt-2 text-xs text-sky-200">Selected: {file.name}</p>
								)}
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-slate-200">Select Drugs</label>
							<div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
								{DRUG_OPTIONS.map((drug) => (
									<label
										key={drug}
										className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-sm transition ${
											selectedDrugs.includes(drug)
												? 'border-sky-300/60 bg-sky-400/15 text-white'
												: 'border-white/10 bg-white/5 text-slate-200 hover:border-sky-300/40 hover:bg-white/10'
										}`}
									>
										<input
											type="checkbox"
											checked={selectedDrugs.includes(drug)}
											onChange={() => onDrugToggle(drug)}
											className="h-4 w-4 rounded border-white/30 bg-slate-900 text-sky-500 focus:ring-sky-500"
										/>
										<span className="select-none">{drug}</span>
									</label>
								))}
							</div>
						</div>

						<div className="flex items-center justify-end gap-3 pt-2">
							<button
								type="submit"
								disabled={submitting}
								className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-900/50 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
							>
								{submitting ? 'Analyzing...' : 'Analyze Risk'}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

