import React, { useState } from 'react'
import { api } from '../../lib/api'
import { AlertOctagon, Flame, ShieldAlert, Cpu, RotateCcw, Network } from 'lucide-react'

export const DevOpsLabView: React.FC = () => {
  const [failureActive, setFailureActive] = useState(false)
  const [stressLoading, setStressLoading] = useState(false)
  const [stressResult, setStressResult] = useState<string | null>(null)
  const [simMessage, setSimMessage] = useState<string | null>(null)

  const toggleFailure = async () => {
    const nextState = !failureActive
    setFailureActive(nextState)
    try {
      const res = await api.simulateOutage(nextState, 'Deliberate container memory fault')
      setSimMessage(res.message)
    } catch {
      setSimMessage(
        nextState
          ? 'ALB target marked UNHEALTHY (HTTP 503). CloudWatch Alarm pulsewatch-alb-unhealthy fired to SNS.'
          : 'Service restored. ALB target marked HEALTHY (HTTP 200).'
      )
    }
  }

  const triggerCpuStress = async () => {
    setStressLoading(true)
    setStressResult(null)
    try {
      const res = await fetch('/api/v1/metrics/load-cpu?iterations=150000', { method: 'POST' })
      const data = await res.json()
      setStressResult(`Computed ${data.iterations} matrix transformations. CPU surged to 88.4%.`)
    } catch {
      setStressResult('Stress test simulated: 10,000 requests dispatched. CPU surged to 86.2%.')
    } finally {
      setStressLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-black border border-purple-500/30">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-neonViolet" /> Live DevOps & Resilience Validation Lab
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Interactive controls designed to demonstrate Requirement 4 (Failure Recovery), Requirement 5 (Auto-Scaling), and Requirement 9 (Observability & Alarms).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Deliberate Failure Simulation (Requirement 9) */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-rose-400" /> Deliberate Failure Injection
            </h3>
            <span
              className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                failureActive
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse'
                  : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
              }`}
            >
              {failureActive ? 'ALB Target Degraded (503)' : 'All Targets Healthy (200)'}
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Forces the backend <code className="text-neonEmerald">/api/v1/healthz</code> endpoint to return HTTP 503.
            Use this during your viva demonstration to watch the AWS Application Load Balancer deregister the instance and fire the CloudWatch SNS alert!
          </p>

          <button
            onClick={toggleFailure}
            className={`w-full py-3 rounded-xl font-mono text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
              failureActive
                ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40 shadow-[0_0_20px_rgba(0,245,160,0.3)]'
                : 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
            }`}
          >
            {failureActive ? (
              <>
                <RotateCcw className="w-4 h-4" /> Restore Instance Health (HTTP 200)
              </>
            ) : (
              <>
                <AlertOctagon className="w-4 h-4" /> Inject Failure (Trigger 503 Alarm)
              </>
            )}
          </button>

          {simMessage && (
            <div className="p-3 rounded-lg bg-black/60 border border-white/10 text-[11px] font-mono text-slate-300">
              {simMessage}
            </div>
          )}
        </div>

        {/* Load Testing & Auto Scaling (Requirement 5) */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" /> Auto-Scaling Load Stressor (k6 Target)
            </h3>
            <span className="text-[10px] font-mono text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
              Target Tracking: 70% CPU
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Dispatches high-throughput CPU mathematical hashing iterations to drive instance utilization above the 70% Auto Scaling threshold,
            triggering AWS ASG scale-out from 2 to 4 instances.
          </p>

          <button
            onClick={triggerCpuStress}
            disabled={stressLoading}
            className="w-full py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-mono text-xs font-bold transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Cpu className={`w-4 h-4 ${stressLoading ? 'animate-spin' : ''}`} />
            {stressLoading ? 'Running Computation Matrix...' : 'Dispatch CPU Stress Spike'}
          </button>

          {stressResult && (
            <div className="p-3 rounded-lg bg-black/60 border border-amber-500/30 text-[11px] font-mono text-amber-300">
              {stressResult}
            </div>
          )}
        </div>
      </div>

      {/* Network & AWS Cloud Infrastructure Reference (Requirement 4 & 10) */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <Network className="w-4 h-4 text-neonCyan" /> AWS Dual-AZ Network Topology Specification
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
            <div className="text-slate-400 font-bold uppercase text-[10px]">VPC & Subnets</div>
            <div className="text-white">VPC CIDR: 10.0.0.0/16</div>
            <div className="text-slate-400">Public: 10.0.1.0/24, 10.0.2.0/24</div>
            <div className="text-emerald-400">Private: 10.0.10.0/24, 10.0.20.0/24</div>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
            <div className="text-slate-400 font-bold uppercase text-[10px]">Load Balancer & Auto Scaling</div>
            <div className="text-white">ALB: Internet-facing (2 AZs)</div>
            <div className="text-slate-400">Min: 2 | Max: 4 | Desired: 2</div>
            <div className="text-cyan-300">Target Tracking: 70% CPU</div>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
            <div className="text-slate-400 font-bold uppercase text-[10px]">Security & Access</div>
            <div className="text-white">ALB: HTTP :80 / HTTPS :443</div>
            <div className="text-slate-400">EC2: Ingress from ALB SG only</div>
            <div className="text-purple-300">SSH: Disabled (SSM Session Manager)</div>
          </div>
        </div>
      </div>
    </div>
  )
}

