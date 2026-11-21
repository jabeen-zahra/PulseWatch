export type MonitorStatus = 'operational' | 'degraded' | 'outage'
export type MonitorType = 'http' | 'ping' | 'ssl'

export interface Monitor {
  id: number
  name: string
  url: string
  monitor_type: MonitorType
  status: MonitorStatus
  uptime_percentage: number
  latency_ms: number
  interval_seconds: number
  last_checked_at: string
  created_at: string
}

export type IncidentSeverity = 'minor' | 'major' | 'critical'
export type IncidentStatus = 'investigating' | 'identified' | 'monitoring' | 'resolved'

export interface Incident {
  id: number
  title: string
  service_name: string
  severity: IncidentSeverity
  status: IncidentStatus
  description: string
  post_mortem?: string
  created_at: string
  resolved_at?: string
}

export interface SystemMetrics {
  timestamp: number
  cpu_usage_percent: number
  memory_usage_percent: number
  p99_latency_ms: number
  requests_per_second: number
  active_monitors_count: number
  global_uptime_sla: number
}

export interface EdgeRegion {
  region: string
  name: string
  latency_ms: number
  status: 'operational' | 'degraded'
}
