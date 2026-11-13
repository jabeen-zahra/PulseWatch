import React from 'react'

export const HeartbeatBar: React.FC<{ uptimePercentage?: number; latencyMs?: number }> = ({
  uptimePercentage = 99.99,
  latencyMs = 18,
}) => {
  // Generate 60 daily tick blocks (Better Stack standard)
  const blocks = Array.from({ length: 60 }, (_, i) => {
    // 98% of the days are pure green operational
    const isDegraded = i === 18
    return {
      day: 60 - i,
      status: isDegraded ? 'degraded' : 'operational',
      uptime: isDegraded ? 99.4 : 100,
      latency: isDegraded ? 120 : Math.floor(latencyMs + (Math.sin(i) * 6)),
    }
  })

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-neonEmerald" />
          <span className="text-white font-semibold">{uptimePercentage}% Uptime</span>
          <span className="text-[11px] text-slate-500">(Past 60 Days)</span>
        </span>
        <span className="text-[11px] text-emerald-400 font-bold">0 Outages Today</span>
      </div>

      {/* The 60-Bar Heartbeat Track */}
      <div className="flex items-center gap-1 w-full h-8 px-2 py-1.5 rounded-lg bg-black/40 border border-white/5">
        {blocks.map((b, idx) => (
          <div
            key={idx}
            className="group relative flex-1 h-full rounded-sm transition-all duration-200 hover:scale-125 hover:z-20 cursor-pointer"
          >
            <div
              className={`w-full h-full rounded-sm transition-colors ${
                b.status === 'operational'
                  ? 'bg-neonEmerald/80 group-hover:bg-neonEmerald group-hover:shadow-[0_0_8px_#00f5a0]'
                  : 'bg-amber-400 group-hover:bg-amber-300 group-hover:shadow-[0_0_8px_#f59e0b]'
              }`}
            />

            {/* Hover Tooltip */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center pointer-events-none z-30">
              <div className="bg-charcoal text-[10px] font-mono text-white px-2.5 py-1.5 rounded-md border border-white/10 shadow-xl whitespace-nowrap">
                <div className="font-bold text-neonEmerald">{b.day} days ago</div>
                <div className="text-slate-300">Uptime: {b.uptime}%</div>
                <div className="text-slate-400">Avg Latency: {b.latency}ms</div>
              </div>
              <div className="w-1.5 h-1.5 bg-charcoal border-r border-b border-white/10 rotate-45 -mt-1" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mt-1.5">
        <span>60 days ago</span>
        <span>Today (100% Operational)</span>
      </div>
    </div>
  )
}

