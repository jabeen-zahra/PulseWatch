import React, { useState } from 'react'
import { Logo } from './components/icons/Logo'
import { LandingHero } from './components/landing/LandingHero'
import { DashboardView } from './components/dashboard/DashboardView'
import { StatusPageView } from './components/status/StatusPageView'
import { DevOpsLabView } from './components/dashboard/DevOpsLabView'
import { LayoutDashboard, Radio, Activity, FlaskConical, Github } from 'lucide-react'

type Tab = 'overview' | 'dashboard' | 'status' | 'devops-lab'

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  return (
    <div className="min-h-screen flex flex-col bg-obsidian text-slate-100">
      {/* Top Glass Navigation Bar */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo className="cursor-pointer" />

          {/* Navigation Tab Pills */}
          <nav className="flex items-center gap-1 sm:gap-2 p-1 rounded-xl bg-black/60 border border-white/10 text-xs font-mono font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'overview'
                  ? 'bg-neonEmerald text-obsidian font-bold shadow-[0_0_15px_rgba(0,245,160,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-neonEmerald text-obsidian font-bold shadow-[0_0_15px_rgba(0,245,160,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('status')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'status'
                  ? 'bg-neonEmerald text-obsidian font-bold shadow-[0_0_15px_rgba(0,245,160,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Status Page</span>
            </button>

            <button
              onClick={() => setActiveTab('devops-lab')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'devops-lab'
                  ? 'bg-neonViolet text-white font-bold shadow-[0_0_15px_rgba(139,92,246,0.5)]'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>DevOps Lab</span>
            </button>
          </nav>

          {/* GitHub Repository Link */}
          <a
            href="https://github.com/jabeen-zahra/PulseWatch"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 transition-all"
          >
            <Github className="w-4 h-4 text-white" />
            <span className="hidden md:inline">GitHub</span>
          </a>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
        {activeTab === 'overview' && (
          <LandingHero onLaunchDashboard={() => setActiveTab('dashboard')} />
        )}
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'status' && <StatusPageView />}
        {activeTab === 'devops-lab' && <DevOpsLabView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4 sm:px-8 bg-black/40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            PulseWatch • Final DevSecOps Microservices Project • Designed with BetterStack Aesthetic
          </div>
          <div className="flex items-center gap-4">
            <span className="text-neonEmerald">Dual-AZ AWS High Availability</span>
            <span>•</span>
            <span className="text-neonCyan">12-Stage DevSecOps Pipeline</span>
            <span>•</span>
            <span className="text-purple-400">Zero-Downtime Rollback</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
