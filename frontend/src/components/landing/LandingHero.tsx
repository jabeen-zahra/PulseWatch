import React from 'react'
import { IsometricInfrastructure } from '../3d/IsometricInfrastructure'
import { ArrowRight, Terminal, Zap, Shield, GitPullRequest, Activity } from 'lucide-react'

export const LandingHero: React.FC<{ onLaunchDashboard: () => void }> = ({ onLaunchDashboard }) => {
  return (
    <div className="space-y-16 py-6">
      {/* Hero Headline */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neonEmerald/10 border border-neonEmerald/30 text-neonEmerald text-xs font-mono font-semibold tracking-wide shadow-[0_0_15px_rgba(0,245,160,0.2)]">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>PRODUCTION-READY CLOUD OBSERVABILITY</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
          Eliminate Downtime with{' '}
          <span className="bg-gradient-to-r from-neonEmerald via-neonCyan to-neonViolet bg-clip-text text-transparent">
            Autonomous Observability
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
          Engineered for mission-critical microservices. Multi-region edge heartbeats, instant
          incident triage, and automated rollback pipelines deployed across AWS Availability Zones.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={onLaunchDashboard}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-neonEmerald hover:bg-neonEmerald/90 text-obsidian font-bold text-sm font-mono tracking-tight transition-all shadow-[0_0_30px_rgba(0,245,160,0.4)] hover:scale-105"
          >
            <span>Launch Studio Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="https://github.com/jabeen-zahra/PulseWatch"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-sm border border-white/10 transition-all font-mono"
          >
            <GitPullRequest className="w-4 h-4 text-neonCyan" />
            <span>View 12-Stage CI/CD</span>
          </a>
        </div>
      </div>

      {/* 3D Isometric Topology Showcase */}
      <div className="relative">
        <IsometricInfrastructure />
      </div>

      {/* Feature Pillar Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-neonEmerald/10 text-neonEmerald border border-neonEmerald/20 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Sub-Second Edge Heartbeats</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Continuous HTTP, SSL, and ICMP synthetic probes dispatched from 5 global edge locations
            every 15 to 60 seconds with nanosecond precision.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-neonCyan/10 text-neonCyan border border-neonCyan/20 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">DevSecOps Shift-Left Security</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every commit passes full Gitleaks secret scans, Snyk dependency audits, SonarCloud
            quality gates, and Trivy CVE scanning before touching AWS.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
            <Terminal className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Zero-Downtime Rollback</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Post-deploy smoke test executes against the live Load Balancer. Any probe failure
            triggers an immediate automated rollback to the previous immutable ECR digest.
          </p>
        </div>
      </div>
    </div>
  )
}
