<p align="center">
  <img src="docs/assets/banner.svg" alt="PulseWatch: Autonomous Edge Observability & Cloud Reliability Engine" width="100%">
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_3-0F172A?style=for-the-badge&logo=tailwindcss&logoColor=38BDF8">
  <img alt="FastAPI" src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white">
  <img alt="Python" src="https://img.shields.io/badge/Python_3.11-3776AB?style=for-the-badge&logo=python&logoColor=white">
  <img alt="Docker" src="https://img.shields.io/badge/Docker_Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white">
  <img alt="AWS ALB" src="https://img.shields.io/badge/AWS_ALB-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white">
  <img alt="CloudWatch" src="https://img.shields.io/badge/CloudWatch-FF4F8B?style=for-the-badge&logo=amazon-cloudwatch&logoColor=white">
  <img alt="Trivy" src="https://img.shields.io/badge/Trivy-00A4A6?style=for-the-badge&logo=aquasec&logoColor=white">
  <img alt="Snyk" src="https://img.shields.io/badge/Snyk-4C158A?style=for-the-badge&logo=snyk&logoColor=white">
  <img alt="Gitleaks" src="https://img.shields.io/badge/Gitleaks-Redacted-red?style=for-the-badge">
</p>

**PulseWatch** is an enterprise-grade cloud observability and synthetic uptime monitoring platform engineered for
mission-critical microservices. Inspired by industry standards like **Better Stack**, **Datadog**, and **Incident.io**,
PulseWatch continuously monitors distributed endpoints across global AWS edge locations, provides instant incident
triage, visualizes infrastructure topology in 3D, and executes autonomous self-healing rollbacks when health checks degrade.

---

## What's inside

| | Capability | Details |
|---|---|---|
| <img src="docs/assets/icons/activity.svg" width="20"> | **Autonomous edge heartbeats** | Synthetic HTTP, SSL, and ICMP probes dispatched with sub-millisecond resolution and interactive 60-interval status strips. |
| <img src="docs/assets/icons/radar.svg" width="20"> | **Global edge latency radar** | Multi-region latency probes across `us-east-1`, `eu-central-1`, `ap-south-1`, `ap-northeast-1`, and `sa-east-1`. |
| <img src="docs/assets/icons/topology.svg" width="20"> | **3D interactive topology** | Three-dimensional visualizer of dual-AZ VPC, ALB routing, EC2 instances, and PostgreSQL primary/replica nodes. |
| <img src="docs/assets/icons/radio.svg" width="20"> | **Public SLA status portal** | Client-facing status page tracking uptime guarantees, operational incidents, and SLA compliance readouts. |
| <img src="docs/assets/icons/sliders.svg" width="20"> | **DevOps & chaos lab** | Interactive evaluation playground for injecting 503 faults, triggering CloudWatch alarms, and simulating k6 CPU load spikes. |
| <img src="docs/assets/icons/shield.svg" width="20"> | **Shift-left DevSecOps** | 12-stage mandatory pipeline: Gitleaks secret scan, ESLint, Prettier, Hadolint, Pytest (>80% cov), SonarCloud, Snyk, and Trivy CVE scanner. |
| <img src="docs/assets/icons/container.svg" width="20"> | **Hardened containerization** | Alpine-based multi-stage Docker builds, non-root system users (`appuser`, `nginx`), immutable ECR digests with semantic and commit-SHA tags. |
| <img src="docs/assets/icons/cloud.svg" width="20"> | **High availability & ASG** | Deployed across two Availability Zones in private subnets behind an Application Load Balancer with target-tracking auto-scaling (70% CPU). |
| <img src="docs/assets/icons/terminal.svg" width="20"> | **Automated smoke rollback** | Stage 12 post-deploy smoke verification; any probe failure immediately triggers an automatic rollback to the previous immutable ECR digest. |
| <img src="docs/assets/icons/bell.svg" width="20"> | **CloudWatch observability** | Centralized structured logging, four-metric dashboard (request rate, errors, latency, CPU/memory), and automated SNS incident alerting. |
| <img src="docs/assets/icons/database.svg" width="20"> | **Resilient data tier** | Relational telemetry store with atomic snapshots, SHA-256 cryptographic verification, and automated retention pruning via `scripts/backup_db.sh`. |

---

## Architecture

```mermaid
flowchart LR
    Client(["External Users / k6 Stress Engine"]) -->|"HTTPS :443 / :80"| IGW["Internet Gateway"]
    IGW --> ALB["Application Load Balancer<br/>Dual-AZ Public Subnets<br/>Health Check: /api/v1/healthz"]
    
    subgraph VPC ["AWS Virtual Private Cloud (10.0.0.0/16)"]
        subgraph AZ_1A ["Availability Zone: us-east-1a"]
            NAT_A["NAT Gateway 1A<br/>(Public Subnet 10.0.1.0/24)"]
            EC2_A["EC2 Instance 1 (ASG)<br/>(Private Subnet 10.0.10.0/24)<br/>Frontend Nginx + FastAPI"]
            DB_A[("PostgreSQL Primary<br/>Port 5432 (Write-Ready)")]
        end

        subgraph AZ_1B ["Availability Zone: us-east-1b"]
            NAT_B["NAT Gateway 1B<br/>(Public Subnet 10.0.2.0/24)"]
            EC2_B["EC2 Instance 2 (ASG)<br/>(Private Subnet 10.0.20.0/24)<br/>Frontend Nginx + FastAPI"]
            DB_B[("PostgreSQL Replica<br/>Port 5432 (Read-Only)")]
        end
    end

    ALB -->|"Target Group Forward"| EC2_A
    ALB -->|"Target Group Forward"| EC2_B
    EC2_A --> DB_A
    EC2_B --> DB_B
    EC2_A -.->|"Outbound egress via NAT"| NAT_A
    EC2_B -.->|"Outbound egress via NAT"| NAT_B

    subgraph Observability ["AWS Monitoring, Logging & Alarms"]
        CW["Amazon CloudWatch<br/>Centralized Logs & Metrics"]
        Alarm["CloudWatch Alarms<br/>Target5XXCount > 0 OR CPU > 70%"]
        SNS["Amazon SNS Alerts<br/>Email & PagerDuty"]
    end

    ALB -.->|"Metrics & Logs"| CW
    EC2_A -.->|"Telemetry & Health"| CW
    EC2_B -.->|"Telemetry & Health"| CW
    CW --> Alarm
    Alarm --> SNS
```

```mermaid
sequenceDiagram
    autonumber
    participant Dev as Engineering Team
    participant GH as GitHub Actions CI/CD
    participant ECR as Amazon ECR (Immutable)
    participant SSM as AWS Systems Manager
    participant ALB as Application Load Balancer
    participant EC2 as EC2 Instances (ASG)

    Dev->>GH: Push / PR to main
    GH->>GH: Execute Stages 1–10 (Security & Quality Gates)
    Note over GH: Failing stage terminates pipeline immediately
    Dev->>GH: Merge Approved PR
    GH->>ECR: Stage 11: Build & push immutable image (v1.0.0-sha)
    GH->>SSM: Trigger Rolling Instance Refresh
    SSM->>EC2: Pull immutable image from ECR & restart containers
    EC2->>ALB: Register target and enter initial health state
    GH->>ALB: Stage 12: Run scripts/smoke_test.sh against ALB URL
    alt Smoke test succeeds (HTTP 200, Ready, Latency < 300ms)
        ALB-->>GH: Status 200 OK
        GH-->>Dev: Deployment Succeeded
    else Smoke test fails (HTTP 503 or probe timeout)
        ALB-->>GH: Probe Failure
        GH->>SSM: Auto-Rollback: Deploy previous stable image digest
        SSM->>EC2: Restore previous container version
        GH-->>Dev: Alert: Smoke test failed. Automated rollback executed.
    end
```

---

## Required 12-Stage DevSecOps Pipeline

The deployment pipeline is partitioned into 10 pre-merge gates and 2 post-merge deployment stages. Security is enforced as code: any High or Critical finding immediately halts the workflow.

```mermaid
flowchart TD
    subgraph CI ["Continuous Integration (Runs on Every Push and Pull Request)"]
        S01["Stage 01: Secret Scanning<br/>Gitleaks (Full git history)"]
        S02["Stage 02: Code Linting<br/>ESLint (TypeScript & React)"]
        S03["Stage 03: Formatting Check<br/>Prettier (Code style consistency)"]
        S04["Stage 04: Dockerfile Linting<br/>Hadolint (Security best practices)"]
        S05["Stage 05: Automated Unit Tests<br/>Pytest with coverage report (>= 80%)"]
        S06["Stage 06: Static Code Analysis<br/>SonarCloud (Quality gate enforcement)"]
        S07["Stage 07: Dependency Scanning<br/>Snyk Open Source (High/Critical CVEs)"]
        S08["Stage 08: Container Image Build<br/>Docker Buildx (Multi-stage cache)"]
        S09["Stage 09: Image Vulnerability Scan<br/>Trivy (Zero High/Critical CVEs)"]
        S10["Stage 10: Status Verification<br/>Required check blocking merge"]
        
        S01 --> S02 --> S03 --> S04 --> S05 --> S06 --> S07 --> S08 --> S09 --> S10
    end

    subgraph CD ["Continuous Delivery (Runs on Merge to main)"]
        S11["Stage 11: Versioned ECR Push & Deploy<br/>OIDC IAM auth, immutable semantic tag, SSM rolling refresh"]
        S12["Stage 12: Live Smoke Test & Rollback<br/>scripts/smoke_test.sh against ALB. Auto-rollback on failure"]
        
        S10 --> S11 --> S12
    end
```

### Pipeline Stage Specification Matrix

| Stage | Name | Target / Tool | Enforcement Threshold |
| :---: | :--- | :--- | :--- |
| **01** | Secret Scanning | `gitleaks/gitleaks-action@v2` | Zero unencrypted secrets in full git history |
| **02** | Code Linting | ESLint 8 (`eslint-plugin-react`) | Zero lint errors and zero warnings (`--max-warnings 0`) |
| **03** | Formatting Check | Prettier (`prettier --check`) | 100% adherence to repository style specification |
| **04** | Dockerfile Linting | `hadolint/hadolint-action@v3.1.0` | Zero errors on multi-stage instructions and root user checks |
| **05** | Automated Tests | Pytest + `pytest-cov` | All unit tests pass with **coverage >= 80%** |
| **06** | Static Analysis | SonarCloud Quality Gate | Passed Quality Gate (A rating, zero security hotspots) |
| **07** | Dependency Scan | Snyk (`snyk/actions/python` & `node`) | Zero High or Critical CVEs in dependencies |
| **08** | Image Build | Docker Buildx (`docker/build-push-action`) | Deterministic multi-stage build using pinned Alpine digests |
| **09** | Image Scan | Aquasec Trivy (`aquasecurity/trivy-action`) | `exit-code: 1` on any High or Critical image vulnerability |
| **10** | Branch Protection | GitHub Actions Status Check | All 9 stages must be green before PR merge is permitted |
| **11** | Immutable Delivery | AWS OIDC + Amazon ECR + AWS SSM | Semantic tag (`v1.0.0`) + git commit SHA with tag immutability |
| **12** | Live Smoke Test | `scripts/smoke_test.sh` | Health probe `/api/v1/healthz` 200 OK + P99 latency < 300ms |

---

## Repository Layout

```
pulsewatch/
├── .github/
│   ├── dependabot.yml           # Automated daily dependency vulnerability tracking
│   └── workflows/
│       ├── devsecops-ci.yml     # Stages 1 to 10: Mandatory pull request validation
│       ├── cd-deploy.yml        # Stage 11 & 12: ECR push, rolling deploy & smoke test
│       └── rollback.yml         # Manual emergency rollback workflow with image tag input
├── frontend/                    # React 18 + Vite + Tailwind CSS + Lucide
│   ├── src/
│   │   ├── components/
│   │   │   ├── 3d/              # Isometric 3D AWS infrastructure topology
│   │   │   ├── dashboard/       # Telemetry studio, heartbeat strips & chaos lab
│   │   │   ├── landing/         # Marketing hero and capability pillars
│   │   │   ├── status/          # Public SLA status portal and incident timeline
│   │   │   └── ui/              # Reusable glassmorphic design system
│   │   ├── lib/api.ts           # Type-safe API client interface
│   │   └── types/index.ts       # Domain telemetry contracts
│   ├── nginx.conf               # Hardened unprivileged Nginx reverse proxy config
│   └── Dockerfile               # Multi-stage unprivileged Alpine container
├── backend/                     # FastAPI asynchronous observability microservice
│   ├── app/
│   │   ├── api/v1/              # Endpoints: /healthz, /ready, /monitors, /metrics
│   │   ├── core/                # Application configuration & security settings
│   │   ├── models/              # SQLAlchemy relational models
│   │   └── schemas/             # Pydantic validation schemas
│   ├── tests/                   # Pytest test suite enforcing >= 80% coverage
│   └── Dockerfile               # Multi-stage Alpine container running as 'appuser'
├── infra/                       # Cloud infrastructure definitions
│   ├── docker-compose.yml       # Local development stack
│   └── docker-compose.prod.yml  # Production multi-service stack for EC2 ASG instances
├── scripts/                     # Non-trivial shell & verification scripts
│   ├── smoke_test.sh            # Post-deploy health probe with automated rollback trigger
│   ├── backup_db.sh             # Atomic SQLite snapshot with SHA-256 integrity check
│   └── load_test.js             # k6 auto-scaling load spike script (CPU > 70%)
├── docs/assets/                 # Vector banner, custom SVG icons & architecture assets
├── SECURITY.md                  # Vulnerability disclosure protocol & scanner baselines
└── docker-compose.yml           # Root one-command local developer entrypoint
```

Each tier interacts strictly through validated contracts:
* **Frontend ⇄ Backend:** REST API contract validated via OpenAPI schemas (`/api/v1`).
* **Backend ⇄ Database:** SQLAlchemy ORM layer with atomic migrations and transactional safety.
* **Pipeline ⇄ AWS Infrastructure:** Short-lived GitHub OIDC authentication; zero hardcoded IAM keys in repository.

---

## Quick Start

### Prerequisites
* Docker & Docker Compose v2 installed locally.

```bash
# 1. Clone repository
git clone https://github.com/jabeen-zahra/PulseWatch.git
cd PulseWatch

# 2. Launch the complete containerized stack locally
docker compose up -d --build

# 3. Access local endpoints
# Frontend Studio & Status Page: http://localhost:80
# Backend OpenAPI Documentation: http://localhost:8000/docs
# Live Health Probe Endpoint:    http://localhost:8000/api/v1/healthz
```

---

## Shell Script Automation

The project includes two production-grade shell scripts and one k6 stress test script, each strictly adhering to `set -euo pipefail` and passing ShellCheck audits:

### 1. Post-Deployment Smoke Verification (`scripts/smoke_test.sh`)
* **Pipeline Integration:** Executed automatically during Stage 12 of the CD workflow.
* **Checks Executed:**
  1. Polls ALB health endpoint `GET /api/v1/healthz` with retry backoff.
  2. Asserts container readiness via `GET /api/v1/ready`.
  3. Executes functional synthetic monitor creation transaction (`POST /api/v1/monitors`).
  4. Measures round-trip HTTP latency, asserting P99 SLA is strictly under 300ms.
* **Self-Healing Action:** Returns exit code `1` upon any probe failure, instructing GitHub Actions to trigger immediate container rollback.

### 2. Database Backup & Cryptographic Checksum (`scripts/backup_db.sh`)
* **Integrity Guarantee:** Takes an atomic snapshot of the relational database.
* **Cryptographic Verification:** Generates a SHA-256 integrity checksum file and verifies digest consistency before saving.
* **Retention Policy:** Automatically identifies and prunes backup archives older than 7 days.

### 3. Auto-Scaling Stress Engine (`scripts/load_test.js`)
* **Execution:** Run with `k6 run scripts/load_test.js`.
* **Behavior:** Ramps up concurrent virtual users from 50 to 400 against the ALB to force CPU utilization past 70%, triggering AWS Auto Scaling scale-out.

---

## AWS Production Infrastructure Specification

The application is deployed across two AWS Availability Zones (`us-east-1a` and `us-east-1b`) in a highly available, multi-tier Virtual Private Cloud:

1. **Virtual Private Cloud (VPC):**
   * Primary CIDR: `10.0.0.0/16`.
   * Public Subnet 1A: `10.0.1.0/24` | Public Subnet 1B: `10.0.2.0/24`.
   * Private Subnet 1A: `10.0.10.0/24` | Private Subnet 1B: `10.0.20.0/24`.
   * Internet Gateway attached to Public Subnets. Dedicated NAT Gateways in each AZ provide secure egress for private subnets.
2. **Security Groups:**
   * `sg-pulsewatch-alb`: Ingress allowed on ports 80/443 from `0.0.0.0/0`.
   * `sg-pulsewatch-instances`: Ingress allowed on port 80 **strictly from `sg-pulsewatch-alb`**. Port 22 (SSH) is completely blocked; all administrative access is handled via AWS Systems Manager Session Manager.
3. **Application Load Balancer (ALB):**
   * Multi-AZ Internet-facing ALB with cross-zone load balancing enabled.
   * Target Group configured with HTTP health checks on `/api/v1/healthz` (Interval: 15s, Healthy Threshold: 2, Unhealthy Threshold: 2).
4. **Auto Scaling Group (ASG):**
   * Minimum: 2 instances | Maximum: 4 instances | Desired: 2 instances spanning `us-east-1a` and `us-east-1b`.
   * Target Tracking Policy: `ASGAverageCPUUtilization` set to **70%**.
   * Launch Template uses Amazon Linux 2023 minimal AMI with Docker Compose configured in UserData.
5. **Observability & Alerting:**
   * Centralized logging configured via CloudWatch Log Groups.
   * Alarm 1: `PulseWatch-UnhealthyTargetCount` (triggers when `UnHealthyHostCount >= 1`).
   * Alarm 2: `PulseWatch-HighCPU` (triggers when `CPUUtilization > 75%` for 2 minutes).
   * Notifications: Both alarms publish to SNS topic `pulsewatch-incident-alerts` for instant notification.

---

## Demonstrations & Viva Runbook

### 1. High Availability & Failure Recovery
1. Open the PulseWatch dashboard in a browser.
2. In the AWS Console or via the **DevOps Lab** interface, terminate an EC2 instance in `us-east-1a` or click **Inject Failure (Trigger 503 Alarm)**.
3. Observe the Application Load Balancer detecting the failure within 15 seconds, taking the unhealthy instance out of rotation.
4. Active user sessions remain completely uninterrupted as the second instance in `us-east-1b` serves all traffic without downtime.
5. The Auto Scaling Group launches a healthy replacement instance automatically.

### 2. Auto-Scaling Under Load
1. Launch the load test script:
   ```bash
   k6 run scripts/load_test.js
   ```
2. Navigate to CloudWatch Metrics to observe CPU utilization exceeding the 70% target.
3. Within 3 minutes, the Auto Scaling Group initiates a Scale-Out event, launching 2 additional instances across both AZs (total: 4 instances).
4. Once the load test terminates, the target tracking policy gracefully cools down and scales the group back in to 2 instances.

### 3. Automated & Manual Rollback
* **Automated Rollback:** Pushing a commit that breaks `/api/v1/healthz` causes Stage 12 (`smoke_test.sh`) to exit with code `1`. GitHub Actions immediately intercepts this failure and re-deploys the previous stable ECR image digest.
* **Manual Emergency Rollback:** Navigate to **Actions** → **Manual Emergency Rollback Workflow** → enter the target version (e.g. `v1.0.0`) → click **Run workflow**.

---

## Engineering Team & Contribution Ledger

| Member | Contact | Ownership & Contributions |
| :--- | :--- | :--- |
| **Jabeen Zahra** | `kaneezezahra313@gmail.com` | **Architecture, Microservices & Frontend Platform Lead**<br>• Designed React 18 observability interface, 3D topology visualizer & status portal.<br>• Engineered FastAPI REST API with health probes (`/healthz`, `/live`, `/ready`).<br>• Implemented GitHub Actions CI Stages 1–4 and root Docker Compose setup. |
| **Fatima Ijaz** | `f6618568@gmail.com` | **DevSecOps, Security Auditing & Container Hardening Specialist**<br>• Hardened Alpine multi-stage Dockerfiles with unprivileged users (`appuser`, `nginx`).<br>• Integrated Gitleaks secret scanner, Snyk dependency audits, and Trivy CVE scanning.<br>• Authored `SECURITY.md`, ShellCheck-compliant `scripts/backup_db.sh`, and Dependabot policy. |
| **Mirfaq Javaid** | `mirfaqjavaid@gmail.com` | **Cloud Infrastructure, Observability & Continuous Delivery Lead**<br>• Configured AWS Dual-AZ VPC, subnets, ALB routing, and Auto Scaling target tracking.<br>• Built OIDC IAM authentication, Amazon ECR immutable versioning, and rolling updates.<br>• Authored Stage 12 `scripts/smoke_test.sh` with automated rollback and k6 load testing script. |

---

## Infrastructure Teardown

```bash
# Terminate local stack
docker compose down -v

# AWS Resource Decommissioning
aws autoscaling delete-auto-scaling-group --auto-scaling-group-name pulsewatch-asg --force-delete
aws elbv2 delete-load-balancer --load-balancer-arn <ALB_ARN>
aws ec2 delete-vpc --vpc-id <VPC_ID>
```
