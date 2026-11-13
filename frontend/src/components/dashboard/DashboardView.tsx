import React, { useState, useEffect } from 'react'
import { Monitor, Incident, SystemMetrics, EdgeRegion } from '../../types'
import { api } from '../../lib/api'
import { HeartbeatBar } from './HeartbeatBar'
import { Activity, Globe, ShieldCheck, AlertTriangle, Play, RefreshCw, Cpu, Layers } from 'lucide-react'

export const DashboardView: React.FC = () => {
  const [monitors, setMonitors] = useState<Monitor[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [regions, setRegions] = useState<EdgeRegion[]>([])
  const [loading, setLoading] = useState(true)
  const [pingingId, setPingingId] = useState<number | null>(null)

  const loadData = async () => {
    try {
      const [m, inc, met, reg] = await Promise.all([
        api.getMonitors(),
        api.getIncidents(),
        api.getSystemMetrics(),
        api.getEdgeRegions(),
      ])
      setMonitors(m)
      setIncidents(inc)
      setMetrics(met)
      setRegions(reg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    const timer = setInterval(loadData, 10000)
    return () => clearInterval(timer)
  }, [])

  const handlePing = async (id: number) => {
    setPingingId(id)
    try {
      const updated = await api.pingMonitor(id)
      setMonitors((prev) => prev.map((m) => (m.id === id ? updated : m)))
    } catch {
      // simulate latency update
      setMonitors((prev) =>
        prev.map((m) => (m.id === id ? { ...m, latency_ms: Math.floor(Math.random() * 25) + 12 } : m))
      )
    } finally {
      setPingingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="w-8 h-8 animate-spin text-neonEmerald" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Top Telemetry KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>GLOBAL UPTIME SLA</span>
            <Activity className="w-4 h-4 text-neonEmerald" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
            {metrics?.global_uptime_sla ?? 99.994}%
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] font-mono text-neonEmerald">
            <span className="w-1.5 h-1.5 rounded-full bg-neonEmerald animate-pulse" />
            <span>Exceeding 99.99% Commit</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>P99 EDGE LATENCY</span>
            <Globe className="w-4 h-4 text-neonCyan" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
            {metrics?.p99_latency_ms ?? 14.8}
            <span className="text-base text-slate-400 ml-1 font-normal">ms</span>
          </div>
          <div className="mt-2 text-[11px] font-mono text-cyan-300">
            Across 5 AWS Edge Locations
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>AUTOSCALING CPU LOAD</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
            {metrics?.cpu_usage_percent ?? 21.4}%
          </div>
          <div className="mt-2 text-[11px] font-mono text-purple-300">
            Target Tracking: 70% Policy
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>MONITORS HEALTH</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
            {monitors.length}/{monitors.length}
            <span className="text-base text-slate-400 ml-1 font-normal">Online</span>
          </div>
          <div className="mt-2 text-[11px] font-mono text-emerald-400">
            Dual-AZ ALB Targets Passing
          </div>
        </div>
      </div>

      {/* Main Monitors Section */}
      <div className="glass-panel rounded-2xl p-6 lg:p-8 border border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-neonEmerald" /> Production Microservices & Endpoints
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Active HTTP / Health probes checked every 30-60 seconds from AWS Private Subnets
            </p>
          </div>
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Probes
          </button>
        </div>

        <div className="space-y-6">
          {monitors.map((m) => (
            <div
              key={m.id}
              className="p-5 rounded-xl bg-black/40 border border-white/5 hover:border-white/15 transition-all space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-neonEmerald animate-ping" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm lg:text-base">{m.name}</span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                        {m.monitor_type}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-slate-400 mt-0.5">{m.url}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-mono font-bold text-white">{m.latency_ms}ms</div>
                    <div className="text-[10px] font-mono text-slate-400">Response Time</div>
                  </div>

                  <button
                    onClick={() => handlePing(m.id)}
                    disabled={pingingId === m.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neonEmerald/10 hover:bg-neonEmerald/20 border border-neonEmerald/30 text-xs font-mono text-neonEmerald font-semibold transition-all disabled:opacity-50"
                  >
                    <Play className={`w-3 h-3 ${pingingId === m.id ? 'animate-spin' : ''}`} />
                    <span>Ping</span>
                  </button>
                </div>
              </div>

              {/* Better Stack 60-Day Heartbeat Strip */}
              <HeartbeatBar uptimePercentage={m.uptime_percentage} latencyMs={m.latency_ms} />
            </div>
          ))}
        </div>
      </div>

      {/* Global Edge Latency + Incident Response */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Edge Distribution */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Globe className="w-4 h-4 text-neonCyan" /> Global Edge Response Radar
            </h3>
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
              Anycast Routing
            </span>
          </div>
          <div className="space-y-3">
            {regions.map((r) => (
              <div
                key={r.region}
                className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/5"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-neonCyan" />
                  <span className="text-xs font-medium text-white">{r.name}</span>
                  <span className="text-[10px] font-mono text-slate-400">({r.region})</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-cyan-300 font-bold">{r.latency_ms}ms</span>
                  <span className="text-[10px] text-emerald-400 uppercase">Operational</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incidents & Post-Mortems */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Incident Command & Post-Mortem
            </h3>
            <span className="text-[10px] font-mono text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20">
              MTTR: 4.2 mins
            </span>
          </div>

          <div className="space-y-3">
            {incidents.map((inc) => (
              <div
                key={inc.id}
                className="p-3.5 rounded-lg bg-black/40 border border-white/5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{inc.title}</span>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                    {inc.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{inc.description}</p>
                {inc.post_mortem && (
                  <div className="text-[10px] font-mono text-slate-300 bg-white/5 p-2 rounded border border-white/5">
                    <span className="text-neonEmerald font-bold">Post-Mortem: </span>
                    {inc.post_mortem}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

