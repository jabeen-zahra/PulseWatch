import React, { useState } from 'react'
import { Server, ShieldCheck, Database, Cpu, RefreshCw } from 'lucide-react'

export const IsometricInfrastructure: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>('alb')
  const [isFailed, setIsFailed] = useState(false)

  return (
    <div className="relative w-full rounded-2xl border border-white/10 bg-gradient-to-b from-[#0d121f] to-[#07090e] p-6 lg:p-10 overflow-hidden shadow-2xl">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-neonEmerald/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-neonViolet/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header controls bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 z-10 relative">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-neonEmerald animate-pulse" />
            <h3 className="font-bold text-white text-base lg:text-lg tracking-tight">
              3D Live Topology: AWS Multi-AZ High-Availability Architecture
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            VPC cidr: 10.0.0.0/16 • Public/Private Subnets (us-east-1a & us-east-1b)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFailed(!isFailed)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all border ${
              isFailed
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
            }`}
          >
            {isFailed ? '⚠️ Recover Instance AZ-1B' : '⚡ Simulate AZ-1B Failure'}
          </button>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-[11px] font-mono text-neonEmerald">
            <RefreshCw className="w-3 h-3 animate-spin text-neonEmerald" /> LIVE REFRESH (1s)
          </div>
        </div>
      </div>

      {/* 3D Isometric Viewport */}
      <div className="relative w-full h-[440px] flex items-center justify-center overflow-hidden">
        <div
          className="relative transition-transform duration-700 ease-out"
          style={{
            transform: 'perspective(1100px) rotateX(46deg) rotateZ(-30deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Isometric Ground Grid Base */}
          <div className="w-[500px] h-[400px] rounded-3xl border border-neonEmerald/20 bg-gradient-to-br from-emerald-950/20 via-slate-900/40 to-transparent shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative grid-background">
            {/* AZ-1A Boundary Box */}
            <div className="absolute top-8 left-8 w-[200px] h-[340px] rounded-2xl border border-dashed border-emerald-500/30 bg-emerald-950/10 p-4">
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                AZ: us-east-1a (Private)
              </span>

              {/* EC2 Node 1 */}
              <div
                onClick={() => setSelectedNode('node-1a')}
                className={`mt-10 cursor-pointer p-3.5 rounded-xl border transition-all ${
                  selectedNode === 'node-1a'
                    ? 'bg-emerald-500/20 border-neonEmerald shadow-[0_0_20px_rgba(0,245,160,0.4)] scale-105'
                    : 'bg-slate-900/80 border-white/10 hover:border-emerald-400/50'
                }`}
                style={{ transform: 'translateZ(30px)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <Cpu className="w-5 h-5 text-neonEmerald" />
                  <span className="w-2 h-2 rounded-full bg-neonEmerald animate-ping" />
                </div>
                <div className="text-xs font-bold text-white">EC2 Instance 01</div>
                <div className="text-[10px] font-mono text-slate-400">10.0.10.45 • 18% CPU</div>
              </div>

              {/* Postgres Primary */}
              <div
                onClick={() => setSelectedNode('db-primary')}
                className={`mt-8 cursor-pointer p-3 rounded-xl border transition-all ${
                  selectedNode === 'db-primary'
                    ? 'bg-cyan-500/20 border-neonCyan shadow-[0_0_20px_rgba(0,210,255,0.4)] scale-105'
                    : 'bg-slate-900/80 border-white/10 hover:border-cyan-400/50'
                }`}
                style={{ transform: 'translateZ(15px)' }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Database className="w-4 h-4 text-neonCyan" />
                  <span className="text-xs font-bold text-white">PostgreSQL Primary</span>
                </div>
                <div className="text-[10px] font-mono text-cyan-300">Port 5432 • Write-Ready</div>
              </div>
            </div>

            {/* AZ-1B Boundary Box */}
            <div className="absolute top-8 right-8 w-[200px] h-[340px] rounded-2xl border border-dashed border-purple-500/30 bg-purple-950/10 p-4">
              <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
                AZ: us-east-1b (Private)
              </span>

              {/* EC2 Node 2 (Fault tolerance demo) */}
              <div
                onClick={() => setSelectedNode('node-1b')}
                className={`mt-10 cursor-pointer p-3.5 rounded-xl border transition-all ${
                  isFailed
                    ? 'bg-rose-950/80 border-rose-500 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                    : selectedNode === 'node-1b'
                      ? 'bg-purple-500/20 border-neonViolet shadow-[0_0_20px_rgba(139,92,246,0.4)] scale-105'
                      : 'bg-slate-900/80 border-white/10 hover:border-purple-400/50'
                }`}
                style={{ transform: 'translateZ(30px)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <Cpu className={`w-5 h-5 ${isFailed ? 'text-rose-400' : 'text-neonViolet'}`} />
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isFailed ? 'bg-rose-500' : 'bg-neonViolet animate-ping'
                    }`}
                  />
                </div>
                <div className="text-xs font-bold text-white">
                  {isFailed ? 'EC2 Node 02 (TERMINATED)' : 'EC2 Instance 02'}
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  {isFailed ? 'ALB Draining • Auto Healing' : '10.0.20.89 • 22% CPU'}
                </div>
              </div>

              {/* Postgres Read Replica */}
              <div
                onClick={() => setSelectedNode('db-replica')}
                className={`mt-8 cursor-pointer p-3 rounded-xl border transition-all ${
                  selectedNode === 'db-replica'
                    ? 'bg-cyan-500/20 border-neonCyan shadow-[0_0_20px_rgba(0,210,255,0.4)] scale-105'
                    : 'bg-slate-900/80 border-white/10 hover:border-cyan-400/50'
                }`}
                style={{ transform: 'translateZ(15px)' }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Database className="w-4 h-4 text-neonCyan" />
                  <span className="text-xs font-bold text-white">PostgreSQL Replica</span>
                </div>
                <div className="text-[10px] font-mono text-cyan-300">Sync Lag: 1.2ms</div>
              </div>
            </div>

            {/* Central Application Load Balancer */}
            <div
              onClick={() => setSelectedNode('alb')}
              className={`absolute -top-12 left-1/2 -translate-x-1/2 w-48 cursor-pointer p-3.5 rounded-2xl border backdrop-blur-md transition-all ${
                selectedNode === 'alb'
                  ? 'bg-emerald-500/25 border-neonEmerald shadow-[0_0_30px_rgba(0,245,160,0.6)] scale-110'
                  : 'bg-black/90 border-white/20 hover:border-neonEmerald'
              }`}
              style={{ transform: 'translateX(-50%) translateZ(65px)' }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <ShieldCheck className="w-5 h-5 text-neonEmerald" />
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-neonEmerald/20 text-neonEmerald border border-neonEmerald/30">
                  ALB :80/443
                </span>
              </div>
              <div className="text-xs font-bold text-white">Application Load Balancer</div>
              <div className="text-[10px] font-mono text-emerald-300">
                Round-Robin • Health: {isFailed ? '1/2 (Degraded)' : '2/2 (Healthy)'}
              </div>
            </div>

            {/* Floating Data Signal Ray */}
            <div
              className="absolute top-6 left-1/2 -translate-x-1/2 w-1 h-32 bg-gradient-to-b from-neonEmerald via-neonCyan to-transparent opacity-75"
              style={{ transform: 'translateX(-50%) translateZ(40px)' }}
            />
          </div>
        </div>
      </div>

      {/* Interactive Node Telemetry Card */}
      <div className="mt-4 p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-neonEmerald/10 text-neonEmerald border border-neonEmerald/20">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase text-slate-400">Inspecting Node</div>
            <div className="text-sm font-bold text-white">
              {selectedNode === 'alb' && 'Dual-AZ Application Load Balancer (AWS ALB)'}
              {selectedNode === 'node-1a' && 'EC2 Auto Scaling Instance (Subnet Private 1A)'}
              {selectedNode === 'node-1b' && 'EC2 Auto Scaling Instance (Subnet Private 1B)'}
              {selectedNode === 'db-primary' && 'Amazon Aurora / RDS PostgreSQL Primary'}
              {selectedNode === 'db-replica' && 'Amazon Aurora / RDS PostgreSQL Read-Replica'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs font-mono">
          <div>
            <span className="text-slate-400">Target Health: </span>
            <span className="text-neonEmerald font-bold">Passing (HTTP 200)</span>
          </div>
          <div>
            <span className="text-slate-400">Security Group: </span>
            <span className="text-neonCyan font-bold">sg-pulsewatch-internal</span>
          </div>
          <div>
            <span className="text-slate-400">IAM Role: </span>
            <span className="text-purple-300 font-bold">EC2-SSM-InstanceProfile</span>
          </div>
        </div>
      </div>
    </div>
  )
}
