import { useState } from 'react'

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
		<div className="min-h-screen bg-white flex items-center justify-center py-12 px-4">
			<div className="w-full max-w-2xl rounded-xl border border-slate-100 bg-white p-8 shadow-lg">
				<h1 className="mb-4 text-2xl font-semibold text-slate-900">
					Pharmacogenomic Risk Analysis
				</h1>
				<p className="mb-6 text-sm text-slate-600">
					Upload a VCF file and select drugs to generate CPIC-aligned risk predictions.
				</p>

				{errors.length > 0 && (
					<div className="mb-4 rounded-md border border-red-100 bg-red-50 p-3 text-sm text-red-800">
						<ul className="list-disc list-inside">
							{errors.map((err, i) => (
								<li key={i}>{err}</li>
							))}
						</ul>
					</div>
				)}

				<form onSubmit={onSubmit} className="space-y-6">
					<div>
						<label className="block text-sm font-medium text-slate-700">VCF File</label>
						<div className="mt-2">
							<input
								type="file"
								accept=".vcf"
								onChange={onFileChange}
								className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
							/>
							<p className="mt-2 text-xs text-slate-500">Accepted: .vcf — Max 5MB</p>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-slate-700">Select Drugs</label>
						<div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
							{DRUG_OPTIONS.map((drug) => (
								<label
									key={drug}
									className={`flex cursor-pointer items-center gap-3 rounded-md border border-slate-100 px-3 py-2 text-sm transition hover:bg-sky-50 ${
										selectedDrugs.includes(drug) ? 'bg-sky-50 border-sky-200' : 'bg-white'
									}`}
								>
									<input
										type="checkbox"
										checked={selectedDrugs.includes(drug)}
										onChange={() => onDrugToggle(drug)}
										className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
									/>
									<span className="select-none text-slate-800">{drug}</span>
								</label>
							))}
						</div>
					</div>

					<div className="flex items-center justify-end gap-3">
						<button
							type="submit"
							disabled={submitting}
							className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition disabled:opacity-60 hover:bg-sky-700"
						>
							Analyze Risk
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

