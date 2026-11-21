import React from 'react'
import { ShieldCheck, CheckCircle2, Bell, Calendar } from 'lucide-react'

export const StatusPageView: React.FC = () => {
  const components = [
    { name: 'API Core Gateway (AWS ALB)', status: 'Operational', uptime: '100.0%' },
    { name: 'User Authentication & JWT Tokens', status: 'Operational', uptime: '99.99%' },
    { name: 'Multi-AZ Database Primary (us-east-1a)', status: 'Operational', uptime: '100.0%' },
    { name: 'Database Read Replica (us-east-1b)', status: 'Operational', uptime: '99.98%' },
    { name: 'Edge Anycast Routing (Route53 DNS)', status: 'Operational', uptime: '100.0%' },
    { name: 'CloudWatch SNS Incident Notifications', status: 'Operational', uptime: '100.0%' },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Public Status Banner */}
      <div className="rounded-3xl p-8 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-black border border-neonEmerald/30 shadow-[0_0_40px_-10px_rgba(0,245,160,0.3)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-neonEmerald/10 text-neonEmerald border border-neonEmerald/30">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                All Systems Fully Operational
              </h1>
              <p className="text-xs font-mono text-emerald-400 mt-1">
                Verified by AWS Application Load Balancer across 2 Availability Zones
              </p>
            </div>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neonEmerald hover:bg-neonEmerald/90 text-obsidian font-bold text-xs font-mono transition-all shadow-[0_0_15px_rgba(0,245,160,0.4)]">
            <Bell className="w-3.5 h-3.5" /> Subscribe to Updates
          </button>
        </div>
      </div>

      {/* Components Health List */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono text-slate-400">
          <span>INFRASTRUCTURE COMPONENT</span>
          <div className="flex gap-8">
            <span>UPTIME (90D)</span>
            <span>CURRENT STATUS</span>
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {components.map((c, i) => (
            <div key={i} className="py-3.5 flex items-center justify-between">
              <span className="text-sm font-semibold text-white">{c.name}</span>
              <div className="flex items-center gap-8 font-mono text-xs">
                <span className="text-slate-400">{c.uptime}</span>
                <span className="flex items-center gap-1.5 text-neonEmerald font-bold bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Incident History */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <Calendar className="w-4 h-4 text-neonCyan" /> Past Incident History
        </h3>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">
                November 18, 2026 - Edge DNS Routing Latency
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                Resolved
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Between 14:20 and 14:45 UTC, our third-party edge transit partner experienced
              intermittent fiber degradation. Automated Route53 health checks shifted all incoming
              traffic to our secondary transit within 40 seconds.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">
                November 08, 2026 - Scheduled Database Minor Version Upgrade
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                Completed
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Zero-downtime rolling maintenance executed successfully across PostgreSQL multi-AZ
              cluster. No requests were dropped.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
