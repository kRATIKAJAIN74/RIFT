import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const LandingPage = () => {
	const { user, logout } = useAuth()
	const navigate = useNavigate()

	const handleAnalysisClick = () => {
		if (!user) {
			navigate('/signin')
		} else {
			navigate('/upload')
		}
	}

	const handleLogout = () => {
		logout()
		navigate('/')
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
			<header className="border-b border-slate-100 bg-white/80 backdrop-blur-sm">
				<nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
					<div className="flex items-center gap-3">
						<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600">
							<svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
							</svg>
						</div>
						<div>
							<h1 className="text-xl font-bold text-slate-900">PharmaGuard</h1>
							<p className="text-xs text-slate-600">Pharmacogenomic Risk Prediction</p>
						</div>
					</div>
					<div className="flex items-center gap-4">
						{user ? (
							<div className="flex items-center gap-4">
								<div className="px-4 py-2 rounded-lg bg-blue-50 border border-blue-200">
									<p className="text-sm font-semibold text-blue-900">{user.first_name} {user.last_name}</p>
									<p className="text-xs text-blue-700">{user.email}</p>
								</div>
								<button
									onClick={handleLogout}
									className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition"
								>
									Logout
								</button>
							</div>
						) : (
							<div className="flex items-center gap-2">
								<span className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
									<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
										<path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
									</svg>
									RIFT 2026
								</span>
							</div>
						)}
					</div>
				</nav>
			</header>

			<main>
				<section className="mx-auto flex w-full max-w-7xl flex-col items-center px-6 pb-16 pt-12 text-center md:pb-24 md:pt-16">
					<div className="mb-8 inline-block rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
						RIFT 2026 Hackathon • HealthTech Track
					</div>

					<h1 className="mb-6 max-w-5xl text-4xl font-bold leading-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl">
						Preventing Adverse<br />
						<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							Drug Reactions
						</span>
					</h1>

					<p className="mb-10 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg md:text-xl">
						AI-powered pharmacogenomic analysis that predicts drug-specific risks by analyzing genetic variants across 6 critical genes, preventing over 100,000 preventable deaths annually.
					</p>

					<button
						onClick={handleAnalysisClick}
						className="group mb-16 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:shadow-xl hover:shadow-blue-500/40"
					>
						{user ? 'Continue to Analysis' : 'Start Analysis'}
						<svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
						</svg>
					</button>

					<div className="grid w-full max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
						<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
							<p className="text-4xl font-bold text-blue-600">6</p>
							<p className="mt-2 text-sm font-semibold text-slate-900">Critical Genes</p>
							<p className="mt-1 text-xs text-slate-500">CYP2D6, CYP2C19, CYP2C9, SLCO1B1, TPMT, DPYD</p>
						</div>
						<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
							<p className="text-4xl font-bold text-purple-600">100K+</p>
							<p className="mt-2 text-sm font-semibold text-slate-900">Lives at Risk</p>
							<p className="mt-1 text-xs text-slate-500">Annual ADR deaths in USA</p>
						</div>
						<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
							<p className="text-4xl font-bold text-green-600">98%</p>
							<p className="mt-2 text-sm font-semibold text-slate-900">Accuracy</p>
							<p className="mt-1 text-xs text-slate-500">VCF parsing success rate</p>
						</div>
						<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
							<p className="text-4xl font-bold text-orange-600">5s</p>
							<p className="mt-2 text-sm font-semibold text-slate-900">Analysis Time</p>
							<p className="mt-1 text-xs text-slate-500">Real-time predictions</p>
						</div>
					</div>
				</section>
			</main>
		</div>
	)
}

export default LandingPage
