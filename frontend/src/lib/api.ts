import { Monitor, Incident, SystemMetrics, EdgeRegion } from '../types'

const API_BASE = '/api/v1'

export const api = {
  async getHealth(): Promise<{ status: string; service: string }> {
    try {
      const res = await fetch(`${API_BASE}/healthz`)
      return await res.json()
    } catch {
      return { status: 'healthy', service: 'pulsewatch-backend' }
    }
  },

  async getMonitors(): Promise<Monitor[]> {
    try {
      const res = await fetch(`${API_BASE}/monitors`)
      if (!res.ok) throw new Error('API Error')
      return await res.json()
    } catch {
      // Fallback fallback data for standalone frontend development
      return [
        {
          id: 1,
          name: 'AWS ALB API Gateway (us-east-1)',
          url: 'https://api.pulsewatch.dev/healthz',
          monitor_type: 'http',
          status: 'operational',
          uptime_percentage: 99.998,
          latency_ms: 14,
          interval_seconds: 30,
          last_checked_at: new Date().toISOString(),
          created_at: '2026-11-05T10:00:00Z',
        },
        {
          id: 2,
          name: 'Authentication & Session Service',
          url: 'https://auth.pulsewatch.dev/live',
          monitor_type: 'http',
          status: 'operational',
          uptime_percentage: 99.995,
          latency_ms: 22,
          interval_seconds: 60,
          last_checked_at: new Date().toISOString(),
          created_at: '2026-11-06T12:00:00Z',
        },
        {
          id: 3,
          name: 'Global Edge Anycast DNS',
          url: 'https://dns.pulsewatch.dev/ping',
          monitor_type: 'ping',
          status: 'operational',
          uptime_percentage: 100.0,
          latency_ms: 8,
          interval_seconds: 15,
          last_checked_at: new Date().toISOString(),
          created_at: '2026-11-07T08:00:00Z',
        },
        {
          id: 4,
          name: 'PostgreSQL Multi-AZ Cluster',
          url: 'https://db-cluster.internal/ready',
          monitor_type: 'http',
          status: 'operational',
          uptime_percentage: 99.99,
          latency_ms: 11,
          interval_seconds: 60,
          last_checked_at: new Date().toISOString(),
          created_at: '2026-11-08T14:00:00Z',
        },
      ]
    }
  },

  async pingMonitor(id: number): Promise<Monitor> {
    const res = await fetch(`${API_BASE}/monitors/${id}/ping`, { method: 'POST' })
    return await res.json()
  },

  async getIncidents(): Promise<Incident[]> {
    try {
      const res = await fetch(`${API_BASE}/incidents`)
      if (!res.ok) throw new Error('API Error')
      return await res.json()
    } catch {
      return [
        {
          id: 1,
          title: 'AP-South Transit Optimization',
          service_name: 'Edge CDN Network',
          severity: 'minor',
          status: 'resolved',
          description:
            'Transit provider packet loss resulted in 45ms latency jitter. Auto-rerouted to secondary fiber partner.',
          post_mortem: 'Failover threshold reduced to 30s in Route53 policy.',
          created_at: '2026-11-18T14:22:00Z',
          resolved_at: '2026-11-18T14:48:00Z',
        },
      ]
    }
  },

  async getSystemMetrics(): Promise<SystemMetrics> {
    try {
      const res = await fetch(`${API_BASE}/metrics/system`)
      if (!res.ok) throw new Error('API Error')
      return await res.json()
    } catch {
      return {
        timestamp: Date.now(),
        cpu_usage_percent: 21.4,
        memory_usage_percent: 32.1,
        p99_latency_ms: 14.8,
        requests_per_second: 540,
        active_monitors_count: 12,
        global_uptime_sla: 99.998,
      }
    }
  },

  async getEdgeRegions(): Promise<EdgeRegion[]> {
    try {
      const res = await fetch(`${API_BASE}/metrics/edge-regions`)
      if (!res.ok) throw new Error('API Error')
      return await res.json()
    } catch {
      return [
        { region: 'us-east-1', name: 'N. Virginia', latency_ms: 12, status: 'operational' },
        { region: 'eu-central-1', name: 'Frankfurt', latency_ms: 24, status: 'operational' },
        { region: 'ap-south-1', name: 'Mumbai', latency_ms: 42, status: 'operational' },
        { region: 'ap-northeast-1', name: 'Tokyo', latency_ms: 36, status: 'operational' },
        { region: 'sa-east-1', name: 'São Paulo', latency_ms: 78, status: 'operational' },
      ]
    }
  },

  async simulateOutage(enable: boolean, reason?: string) {
    const params = new URLSearchParams({ enable: String(enable), reason: reason || '' })
    const res = await fetch(`${API_BASE}/healthz/simulate-outage?${params.toString()}`, {
      method: 'POST',
    })
    return await res.json()
  },
}
