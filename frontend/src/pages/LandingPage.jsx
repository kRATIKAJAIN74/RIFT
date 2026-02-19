import { Link } from 'react-router-dom'

const LandingPage = () => {
	return (
		<div className="min-h-screen bg-slate-950 text-slate-100">
			<div className="absolute inset-0 -z-10 overflow-hidden">
				<div className="absolute left-1/2 top-[-320px] h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-sky-500/20 blur-3xl" />
				<div className="absolute bottom-[-260px] right-[-140px] h-[420px] w-[420px] rounded-full bg-indigo-500/20 blur-3xl" />
			</div>

			<header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
				<nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
					<div className="text-xl font-semibold tracking-tight text-white">
						<span className="text-sky-400">Pharma</span>Guard
					</div>
					<div className="flex items-center gap-3">
						<a
							href="https://github.com"
							target="_blank"
							rel="noreferrer"
							className="hidden items-center rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-sky-300/60 hover:text-sky-200 sm:inline-flex"
						>
							GitHub
						</a>
						<Link to="/upload" className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-900/40 transition hover:bg-sky-400">
							Start Analysis
						</Link>
					</div>
				</nav>
			</header>

			<main>
				<section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-16 pt-14 md:pb-24 md:pt-20">
					<div className="flex flex-col gap-6">
						<span className="w-fit rounded-full border border-sky-300/40 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-200">
							Clinical Decision Support
						</span>
						<h1 className="max-w-4xl text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-6xl">
							AI-Powered Pharmacogenomic Risk Prediction
						</h1>
						<p className="max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
							Upload your VCF file to receive CPIC-aligned risk predictions and
							actionable pharmacogenomic insights. PharmaGuard helps clinicians
							identify adverse drug response risks with clear, evidence-based
							guidance.
						</p>
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
							<Link to="/upload" className="w-full rounded-full bg-sky-500 px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-sky-900/50 transition hover:bg-sky-400 sm:w-auto">
								Start Analysis
							</Link>
							<a
								href="#"
								className="w-full rounded-full border border-white/20 px-6 py-3 text-center text-sm font-semibold text-slate-200 transition hover:border-sky-300/50 hover:text-sky-200 sm:w-auto"
							>
								Learn More
							</a>
						</div>
						<div className="mt-4 grid w-full max-w-3xl gap-4 sm:grid-cols-3">
							<div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
								<p className="text-2xl font-semibold text-white">98.7%</p>
								<p className="mt-1 text-xs uppercase tracking-wide text-slate-300">Prediction confidence</p>
							</div>
							<div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
								<p className="text-2xl font-semibold text-white">CPIC</p>
								<p className="mt-1 text-xs uppercase tracking-wide text-slate-300">Guideline aligned</p>
							</div>
							<div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
								<p className="text-2xl font-semibold text-white">Minutes</p>
								<p className="mt-1 text-xs uppercase tracking-wide text-slate-300">Turnaround time</p>
							</div>
						</div>
					</div>

					<div className="grid gap-6 md:grid-cols-3">
						<div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
							<h3 className="text-base font-semibold text-white">
								Secure Variant Intake
							</h3>
							<p className="mt-2 text-sm text-slate-300">
								Encrypted VCF ingestion with audit-ready access controls and
								traceable analysis pipelines.
							</p>
						</div>
						<div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
							<h3 className="text-base font-semibold text-white">
								CPIC-Aligned Reports
							</h3>
							<p className="mt-2 text-sm text-slate-300">
								Summaries mapped to CPIC guidelines with clear medication risk
								tiers and clinical actions.
							</p>
						</div>
						<div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
							<h3 className="text-base font-semibold text-white">
								Clinician-Focused Output
							</h3>
							<p className="mt-2 text-sm text-slate-300">
								Readable recommendations, risk stratification, and next-step
								actions designed for faster clinical decisions.
							</p>
						</div>
					</div>
				</section>
			</main>
		</div>
	)
}

export default LandingPage
