# PulseWatch DevSecOps Security Policy & Compliance Disclosure

## Core Security Philosophy
Security in **PulseWatch** is shifted completely left. Every line of code, container layer, dependency, and configuration is continuously inspected across our 12-stage automated pipeline before reaching AWS infrastructure.

---

## 1. Automated Security Scanning Architecture
Our CI pipeline enforces zero-tolerance blocking gates:

| Scanner | Target | Policy & Blocking Threshold | Action on Failure |
| :--- | :--- | :--- | :--- |
| **Gitleaks** | Full Git Commit History | Any exposed API key, private key, or credential | Immediate pipeline failure & PR block |
| **Hadolint** | Multi-stage Dockerfiles | Best practices, non-root user, version pinning | Immediate build rejection |
| **SonarCloud** | Code Quality & Complexity | Maintainability & Security Quality Gate | PR merge blocked |
| **Snyk** | Python & Node Dependencies | High or Critical severity CVEs | Pipeline stop; Dependabot alert triggered |
| **Trivy** | Container Images | High or Critical CVEs in OS or libraries | Image push blocked to Amazon ECR |

---

## 2. Infrastructure & Access Hardening
1. **Least-Privilege IAM & OIDC:**
   - GitHub Actions connects to AWS exclusively via **OpenID Connect (OIDC)** using `sts:AssumeRoleWithWebIdentity`. No static long-lived AWS Access Keys exist in GitHub Secrets.
2. **SSH Disabled:**
   - EC2 instances in private subnets have port 22 completely disabled. Operator maintenance is conducted via **AWS Systems Manager (SSM) Session Manager** with full audit logging.
3. **Private Subnet Isolation:**
   - Instances run strictly in private subnets across 2 Availability Zones (`us-east-1a` and `us-east-1b`). They receive inbound traffic only from the Application Load Balancer security group (`sg-pulsewatch-alb`).
4. **Non-Root Containers:**
   - Backend runs as system user `appuser` (UID 10001).
   - Frontend runs as unprivileged `nginx` user.

---

## 3. Vulnerability Reporting
If you discover a security vulnerability in PulseWatch:
- Email: `kaneezezahra313@gmail.com`
- Group: Jabeen Zahra, Fatima Ijaz, Mirfaq Javaid
- Response Window: Within 24 hours

