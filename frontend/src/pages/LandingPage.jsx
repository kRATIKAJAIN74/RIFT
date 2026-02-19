import { Link } from 'react-router-dom'

const LandingPage = () => {
	return (
		<div className="min-h-screen bg-white text-slate-900">
			<header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100 shadow-sm">
				<nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
					<div className="text-xl font-semibold tracking-tight text-slate-900">
						<span className="text-sky-600">Pharma</span>Guard
					</div>
					<div className="flex items-center gap-3">
						<a
							href="https://github.com"
							target="_blank"
							rel="noreferrer"
							className="hidden items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-200 hover:text-sky-700 sm:inline-flex"
						>
							GitHub
						</a>
						<Link to="/upload" className="rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700">
							Start Analysis
						</Link>
					</div>
				</nav>
			</header>

			<main>
				<section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 md:py-24">
					<div className="flex flex-col gap-6">
						<span className="w-fit rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700">
							Clinical Decision Support
						</span>
						<h1 className="text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl md:text-5xl">
							AI-Powered Pharmacogenomic Risk Prediction
						</h1>
						<p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
							Upload your VCF file to receive CPIC-aligned risk predictions and
							actionable pharmacogenomic insights. PharmaGuard helps clinicians
							identify adverse drug response risks with clear, evidence-based
							guidance.
						</p>
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
							<Link to="/upload" className="w-full rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 sm:w-auto text-center">
								Start Analysis
							</Link>
							<a
								href="#"
								className="w-full rounded-full border border-slate-200 px-6 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:text-sky-700 sm:w-auto"
							>
								Learn More
							</a>
						</div>
					</div>

					<div className="grid gap-6 sm:grid-cols-2">
						<div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
							<h3 className="text-base font-semibold text-slate-900">
								Secure Variant Intake
							</h3>
							<p className="mt-2 text-sm text-slate-600">
								Encrypted VCF ingestion with audit-ready access controls and
								traceable analysis pipelines.
							</p>
						</div>
						<div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
							<h3 className="text-base font-semibold text-slate-900">
								CPIC-Aligned Reports
							</h3>
							<p className="mt-2 text-sm text-slate-600">
								Summaries mapped to CPIC guidelines with clear medication risk
								tiers and clinical actions.
							</p>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
};

export default LandingPage;
