import http from 'k6/http';
import { check, sleep } from 'k6';

// =============================================================================
// PulseWatch Auto-Scaling Load Test Script (Requirement 5)
// Simulates concurrent user traffic to trigger CloudWatch CPUUtilization > 70%
// and demonstrate AWS Auto Scaling Group scale-out from 2 to 4 EC2 instances.
// =============================================================================

export const options = {
  stages: [
    { duration: '30s', target: 50 },   // Warm-up ramp: 50 Virtual Users
    { duration: '1m',  target: 200 },  // Traffic surge: 200 Virtual Users (triggers CPU spike)
    { duration: '2m',  target: 400 },  // Sustained load: 400 VUs (ASG scales out to 4 instances)
    { duration: '1m',  target: 50 },   // Traffic drop: scale-in demonstration
    { duration: '30s', target: 0 },    // Cooldown ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<400'], // 95% of requests must complete below 400ms
    http_req_failed: ['rate<0.01'],    // Error rate must stay below 1%
  },
};

const BASE_URL = __ENV.TARGET_URL || 'http://localhost';

export default function () {
  // 1. Hit the health probe
  const healthRes = http.get(`${BASE_URL}/api/v1/healthz`);
  check(healthRes, {
    'healthz status is 200': (r) => r.status === 200,
  });

  // 2. Fetch live monitors
  const monitorsRes = http.get(`${BASE_URL}/api/v1/monitors`);
  check(monitorsRes, {
    'monitors status is 200': (r) => r.status === 200,
  });

  // 3. Dispatch CPU computational load
  const loadRes = http.post(`${BASE_URL}/api/v1/metrics/load-cpu?iterations=5000`);
  check(loadRes, {
    'load-cpu status is 200': (r) => r.status === 200,
  });

  sleep(0.5);
}

