---
name: expert-cloud-agent-architecture
description: Expert-level cloud architecture (AWS/GCP/Serverless/ECS), Terraform IaC, event-driven microservices, FinOps, resilience patterns, and autonomous AI agentic system design.
---

# Expert Cloud Architecture & Agentic System Design Skill

This skill transforms the agent into a **Principal Cloud Architect & AI Systems Engineer**. It provides operational frameworks for cloud infrastructure design (AWS/GCP), serverless/container deployment, Infrastructure as Code (Terraform), event-driven microservices, cost optimization (FinOps), and autonomous AI agent orchestration.

---

## ☁️ 1. Multi-Cloud & Container Architecture Standards

When architecting production cloud workloads, enforce the following topology:

```
  Client / Browser
         │
         ▼
 ┌────────────────────────────────────────────────────────┐
 │ Cloudflare Edge Layer (DNS, WAF, SSL, Edge Cache)      │
 └──────────────────────────┬─────────────────────────────┘
                            ▼
 ┌────────────────────────────────────────────────────────┐
 │ AWS VPC (Public Subnets: ALB / NAT Gateways)           │
 └──────────────────────────┬─────────────────────────────┘
                            ▼
 ┌────────────────────────────────────────────────────────┐
 │ AWS VPC (Private Subnets: ECS Fargate Containers)      │
 │ Next.js / API Workers / Agent Execution Engines        │
 └──────┬───────────────────┬───────────────────┬─────────┘
        ▼                   ▼                   ▼
 ┌──────────────┐   ┌──────────────┐   ┌────────────────┐
 │ Aurora DB    │   │ ElastiCache  │   │ Cloudflare R2  │
 │ Postgres v2  │   │ Redis Cluster│   │ Object Storage │
 └──────────────┘   └──────────────┘   └────────────────┘
```

### Infrastructure Principles
1. **Zero Public DB Exposure**: Database & cache clusters must remain strictly in private subnets with Security Group ingress isolated to the container task group.
2. **Stateless Compute Containers**: Store transient cache in Redis and blob assets in Cloudflare R2 / AWS S3. Never rely on container local disk.
3. **Database Connection Pooling**: Use PgBouncer / RDS Proxy for serverless/container connection recycling to eliminate connection starvation.

---

## 🛠️ 2. Infrastructure as Code (IaC) — Terraform / OpenTofu

Structure all IaC declarative code cleanly into modular packages:

```
infra/
├── main.tf                 # Provider configurations & backend state
├── variables.tf            # Strictly typed environment variables
├── outputs.tf              # Endpoint URLs & ARN exports
└── modules/
    ├── vpc/                # Subnets, NAT, Internet Gateway, Route Tables
    ├── ecs_fargate/        # Task definitions, ALB target groups, auto-scaler
    ├── database_aurora/    # Serverless v2 cluster & auto-scaling parameters
    └── cloudflare_r2/      # S3-compatible object bucket & CORS policies
```

### Security & Secret Governance Rule
- Never hardcode API keys, secrets, or database credentials.
- Inject secrets runtime via AWS Secrets Manager or HashiCorp Vault into container environment definitions.

---

## 🤖 3. Autonomous AI Agent System Design & Guardrails

When engineering autonomous AI agent systems (e.g., multi-agent teams monitoring data streams):

### Proposal-Execute Architecture (Human-in-the-Loop)
Agents must **NEVER** modify production infrastructure or financial balances silently. Always enforce a 4-phase execution flow:

```
  Agent Data Scanner → Formulate Action → Write Proposal (Status: PROPOSED)
                                                  │
                                                  ▼
  Audit Log Record ◄── Execute API Call ◄── Human Approval / Autopilot
```

1. **State Isolation**: Proposals are written into an immutable audit table (`AgentAction`).
2. **Pre-Flight Validation**: On human approval, the executor must re-fetch fresh live data and re-validate numeric guardrails before calling platform APIs.
3. **Rollback Strategy**: Implement compensation transactions (Saga pattern) if multi-step actions fail mid-way.
4. **Deduplication Window**: Hash proposal payload `(org_id, action_type, target_entity)` to prevent duplicate agent actions within a 7-day post-decision window.

---

## 💰 4. FinOps & AWS Well-Architected Framework

Enforce cost & performance optimization across 5 pillars:

| Pillar | Strategy & Enforcement |
| :--- | :--- |
| **Operational Excellence** | Automated CI/CD pipelines via GitHub Actions with rollback capabilities on failed health checks. |
| **Security** | IAM Least Privilege, KMS encryption at rest, TLS 1.3 in transit, and secret rotation policies. |
| **Reliability** | Multi-AZ deployments, circuit breakers for 3rd-party APIs, and automatic database failover. |
| **Performance Efficiency** | Redis caching for hot database rows, CDN edge caching for static assets, and async queue workers. |
| **Cost Optimization** | Aurora Serverless v2 scale-down to minimum ACUs (0.5 ACU during off-peak), Fargate Spot capacity providers. |

---

## 🔌 5. Model Context Protocol (MCP) & Provider Factory

Access LLM providers through a unified provider factory (`getAiClient()`):

```typescript
// Unified Provider Resolution Strategy
export function getAiClient(options?: { forceProvider?: string }) {
  const provider = options?.forceProvider
    || process.env.AI_PROVIDER_FORCE
    || getGlobalAdminToggle()
    || 'anthropic';

  switch (provider) {
    case 'anthropic':
      return createAnthropicClient();
    case 'openai':
      return createOpenAIClient();
    case 'gemini':
      return createGeminiClient();
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}
```

### Outage Failover Rule
In the event of a provider API degradation, the system must gracefully fall back to backup provider adapters without requiring code redeployment.
