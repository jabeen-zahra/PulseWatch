import React from 'react'

export const Logo: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 32 }) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Animated Radar Pulse Ring */}
        <div className="absolute inset-0 rounded-xl bg-neonEmerald/20 animate-ping" style={{ animationDuration: '3s' }} />
        <div className="relative rounded-xl bg-gradient-to-br from-charcoal to-surface border border-neonEmerald/40 p-2 shadow-[0_0_20px_-3px_rgba(0,245,160,0.5)]">
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-neonEmerald"
          >
            {/* Hexagonal Shield Path */}
            <path
              d="M12 2L3 7V12C3 17.5 7 21.5 12 22C17 21.5 21 17.5 21 12V7L12 2Z"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-40"
            />
            {/* Live Heartbeat Pulse Wave */}
            <path
              d="M6 12H9L10.5 8L13.5 16L15 12H18"
              stroke="#00f5a0"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="1.5" fill="#00f5a0" />
          </svg>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-lg tracking-tight text-white font-['Plus_Jakarta_Sans']">
            Pulse<span className="text-neonEmerald">Watch</span>
          </span>
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-neonEmerald/10 text-neonEmerald border border-neonEmerald/30">
            PROD
          </span>
        </div>
        <p className="text-[10px] text-slate-400 font-mono tracking-wide">CLOUDWATCH OBSERVABILITY</p>
      </div>
    </div>
  )
}

