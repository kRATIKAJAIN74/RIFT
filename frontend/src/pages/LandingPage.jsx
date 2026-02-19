import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import ThemeToggle from '../components/ThemeToggle'

const LandingPage = () => {
	const { user, logout } = useAuth()
	const navigate = useNavigate()
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
		<div className="relative w-full">
			<video
				autoPlay
				loop
				muted
				playsInline
				className="fixed inset-0 h-screen w-screen object-cover opacity-80"
				style={{ zIndex: 0 }}
			>
				<source src="/landing.mp4" type="video/mp4" />
			</video>

			<div className="relative z-10 min-h-screen bg-gradient-to-b from-slate-50/80 to-white/80 dark:from-slate-900/90 dark:to-slate-800/90">
			<header className="border-b border-slate-100 bg-white/80 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80">
				<nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 py-4">
					{/* Logo */}
					<div className="flex items-center gap-2 sm:gap-3">
						<div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600">
							<svg className="h-6 w-6 sm:h-7 sm:w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
							</svg>
						</div>
						<div className="hidden sm:block">
							<h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">PharmaGuard</h1>
							<p className="text-xs text-slate-600 dark:text-slate-400">Pharmacogenomic Risk Prediction</p>
						</div>
					</div>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center gap-3 lg:gap-4">
						<ThemeToggle />
						{user ? (
							<>
								<div className="px-3 lg:px-4 py-2 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-900/30 dark:border-blue-700">
									<p className="text-sm font-semibold text-blue-900 dark:text-blue-100 truncate max-w-[150px]">{user.first_name} {user.last_name}</p>
									<p className="text-xs text-blue-700 dark:text-blue-300 truncate max-w-[150px]">{user.email}</p>
								</div>
								<button
									onClick={handleLogout}
									className="px-3 lg:px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 text-sm"
								>
									Logout
								</button>
							</>
						) : (
							<span className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-100">
								<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
									<path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
								</svg>
								RIFT 2026
							</span>
						)}
					</div>

					{/* Mobile Menu Button */}
					<div className="flex md:hidden items-center gap-2">
						<ThemeToggle />
						<button
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition"
							aria-label="Toggle menu"
						>
							{mobileMenuOpen ? (
								<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							) : (
								<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
								</svg>
							)}
						</button>
					</div>
				</nav>

				{/* Mobile Menu */}
				{mobileMenuOpen && (
					<div className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
						<div className="px-4 py-4 space-y-3">
							{user ? (
								<>
									<div className="px-4 py-3 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-900/30 dark:border-blue-700">
										<p className="text-sm font-semibold text-blue-900 dark:text-blue-100">{user.first_name} {user.last_name}</p>
										<p className="text-xs text-blue-700 dark:text-blue-300 mt-1">{user.email}</p>
									</div>
									<button
										onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
										className="w-full px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 text-center"
									>
										Logout
									</button>
								</>
							) : (
								<div className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/30">
									<svg className="h-5 w-5 text-blue-700 dark:text-blue-300" fill="currentColor" viewBox="0 0 20 20">
										<path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
									</svg>
									<span className="text-sm font-medium text-blue-700 dark:text-blue-100">RIFT 2026</span>
								</div>
							)}
						</div>
					</div>
				)}
			</header>

			<main>
				<section className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 sm:px-6 pb-12 sm:pb-16 pt-8 sm:pt-12 text-center md:pb-24 md:pt-16">
					<div className="mb-6 sm:mb-8 inline-block rounded-full border border-blue-200 bg-blue-50 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-blue-700 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-100">
						RIFT 2026 Hackathon • HealthTech Track
					</div>

					<h1 className="mb-4 sm:mb-6 max-w-5xl text-3xl sm:text-4xl font-bold leading-tight text-slate-900 dark:text-white md:text-5xl lg:text-6xl xl:text-7xl px-4">
						Preventing Adverse<br />
						<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							Drug Reactions
						</span>
					</h1>

					<p className="mb-8 sm:mb-10 max-w-3xl text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 md:text-lg lg:text-xl px-4">
						AI-powered pharmacogenomic analysis that predicts drug-specific risks by analyzing genetic variants across 6 critical genes, preventing over 100,000 preventable deaths annually.
					</p>

					<button
						onClick={handleAnalysisClick}
						className="group mb-12 sm:mb-16 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:shadow-xl hover:shadow-blue-500/40"
					>
						{user ? 'Continue to Analysis' : 'Start Analysis'}
						<svg className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
						</svg>
					</button>

					<div className="grid w-full max-w-6xl gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4 px-4">
						<div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
							<p className="text-3xl sm:text-4xl font-bold text-blue-600">6</p>
							<p className="mt-2 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">Critical Genes</p>
							<p className="mt-1 text-xs text-slate-500 dark:text-slate-400 hidden sm:block">CYP2D6, CYP2C19, CYP2C9, SLCO1B1, TPMT, DPYD</p>
						</div>
						<div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
							<p className="text-3xl sm:text-4xl font-bold text-purple-600">100K+</p>
							<p className="mt-2 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">Lives at Risk</p>
							<p className="mt-1 text-xs text-slate-500 dark:text-slate-400 hidden sm:block">Annual ADR deaths in USA</p>
						</div>
						<div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
							<p className="text-3xl sm:text-4xl font-bold text-green-600">98%</p>
							<p className="mt-2 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">Accuracy</p>
							<p className="mt-1 text-xs text-slate-500 dark:text-slate-400 hidden sm:block">VCF parsing success rate</p>
						</div>
						<div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
							<p className="text-3xl sm:text-4xl font-bold text-orange-600">5s</p>
							<p className="mt-2 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">Analysis Time</p>
							<p className="mt-1 text-xs text-slate-500 dark:text-slate-400 hidden sm:block">Real-time predictions</p>
						</div>
					</div>
				</section>
			</main>
			</div>
		</div>
	)
}

export default LandingPage
