# RemitBuddy Agent Automation System - Architecture Design

> **Status**: 설계 완료, 구현 대기
> **Created**: 2026-04-19
> **Author**: Claude Code + User

---

## Overview

12시간 주기로 에이전트들이 자동으로 작업을 수행하는 시스템 설계입니다.

### 핵심 아이디어

1. `news-collector`가 최신 환율/해외송금 뉴스를 수집
2. 수집된 뉴스 데이터를 모든 오케스트레이터에 분배
3. 각 오케스트레이터가 자신의 역할에 맞는 작업 수행
4. 결과물을 Notion에 저장하고 Slack으로 알림

### 선택된 아키텍처: Option B (CLI Wrapper)

n8n이 Automation Server를 트리거하고, Automation Server가 Claude Code CLI를 실행하는 구조입니다.

**장점:**
- 현재 `.claude/agents/*.md` 그대로 사용 가능
- Claude Code의 모든 도구(WebSearch, Notion MCP 등) 활용
- 유지보수 간편

---

## System Architecture

```
┌────────────────────────────────────────────────────────────────────────────┐
│                         RemitBuddy Agent Automation System                  │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │                            n8n (Orchestration Layer)                  │ │
│  │                                                                       │ │
│  │   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐           │ │
│  │   │ Cron Trigger│     │  Webhook    │     │  Manual     │           │ │
│  │   │  (12시간)    │     │  Trigger    │     │  Trigger    │           │ │
│  │   └──────┬──────┘     └──────┬──────┘     └──────┬──────┘           │ │
│  │          │                   │                   │                   │ │
│  │          └───────────────────┴───────────────────┘                   │ │
│  │                              │                                        │ │
│  │                              ▼                                        │ │
│  │                    ┌─────────────────┐                               │ │
│  │                    │  Workflow Router │                               │ │
│  │                    └────────┬────────┘                               │ │
│  └─────────────────────────────┼────────────────────────────────────────┘ │
│                                │                                          │
│  ┌─────────────────────────────▼────────────────────────────────────────┐ │
│  │                      Automation Server (Node.js)                      │ │
│  │                                                                       │ │
│  │   ┌───────────────────────────────────────────────────────────────┐  │ │
│  │   │                    Agent Runner Service                        │  │ │
│  │   │                                                                │  │ │
│  │   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │  │ │
│  │   │  │ Queue Mgr   │  │ CLI Executor│  │ Output Parser       │   │  │ │
│  │   │  │ (Bull/Redis)│──│ (claude cli)│──│ (JSON/Markdown)     │   │  │ │
│  │   │  └─────────────┘  └─────────────┘  └─────────────────────┘   │  │ │
│  │   └───────────────────────────────────────────────────────────────┘  │ │
│  │                                │                                      │ │
│  │                                ▼                                      │ │
│  │   ┌───────────────────────────────────────────────────────────────┐  │ │
│  │   │                    State Manager                               │  │ │
│  │   │                                                                │  │ │
│  │   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │  │ │
│  │   │  │ Notion Sync │  │ File Store  │  │ Execution Log       │   │  │ │
│  │   │  │ (MCP API)   │  │ (JSON/MD)   │  │ (History)           │   │  │ │
│  │   │  └─────────────┘  └─────────────┘  └─────────────────────┘   │  │ │
│  │   └───────────────────────────────────────────────────────────────┘  │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  ┌───────────────────────────────────────────────────────────────────────┐│
│  │                         Claude Code CLI Layer                         ││
│  │                                                                       ││
│  │  ┌─────────────────────────────────────────────────────────────────┐ ││
│  │  │                    .claude/agents/*.md                           │ ││
│  │  │                                                                  │ ││
│  │  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │ ││
│  │  │  │news-collector│  │content-orch  │  │marketing-orch│          │ ││
│  │  │  └──────────────┘  └──────────────┘  └──────────────┘          │ ││
│  │  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │ ││
│  │  │  │business-orch │  │perf-orch     │  │dev-orch      │          │ ││
│  │  │  └──────────────┘  └──────────────┘  └──────────────┘          │ ││
│  │  └─────────────────────────────────────────────────────────────────┘ ││
│  └───────────────────────────────────────────────────────────────────────┘│
│                                                                            │
│  ┌───────────────────────────────────────────────────────────────────────┐│
│  │                          Data Layer                                   ││
│  │                                                                       ││
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ ││
│  │  │  Notion DB  │  │  File System│  │   Redis     │  │  PostgreSQL │ ││
│  │  │  (Content)  │  │  (Outputs)  │  │  (Queue)    │  │  (Logs)     │ ││
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ ││
│  └───────────────────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
/remitbuddy
├── .claude/
│   └── agents/                    # 기존 에이전트 정의 (유지)
│       ├── remitbuddy-news-collector.md
│       ├── remitbuddy-content-orchestrator.md
│       ├── remitbuddy-marketing-orchestrator.md
│       ├── remitbuddy-business-orchestrator.md
│       ├── remitbuddy-performance-orchestrator.md
│       └── ...
│
├── automation/                    # 자동화 시스템
│   ├── package.json
│   ├── tsconfig.json
│   │
│   ├── src/
│   │   ├── index.ts              # 메인 엔트리포인트
│   │   │
│   │   ├── config/
│   │   │   ├── agents.ts         # 에이전트 설정
│   │   │   ├── workflows.ts      # 워크플로우 정의
│   │   │   └── env.ts            # 환경변수
│   │   │
│   │   ├── core/
│   │   │   ├── agent-runner.ts   # Claude CLI 실행기
│   │   │   ├── queue-manager.ts  # 작업 큐 관리
│   │   │   ├── output-parser.ts  # 출력 파싱
│   │   │   └── state-manager.ts  # 상태 관리
│   │   │
│   │   ├── workflows/
│   │   │   ├── daily-news.ts     # 12시간 뉴스 수집
│   │   │   ├── content-pipeline.ts
│   │   │   ├── marketing-pipeline.ts
│   │   │   └── business-pipeline.ts
│   │   │
│   │   ├── integrations/
│   │   │   ├── notion.ts         # Notion API 연동
│   │   │   ├── slack.ts          # Slack 알림
│   │   │   └── n8n-webhook.ts    # n8n 웹훅 핸들러
│   │   │
│   │   └── utils/
│   │       ├── logger.ts
│   │       ├── retry.ts
│   │       └── validators.ts
│   │
│   ├── scripts/
│   │   ├── run-agent.sh          # CLI 실행 스크립트
│   │   └── health-check.sh
│   │
│   └── tests/
│       └── ...
│
├── data/                          # 데이터 저장소
│   ├── outputs/
│   │   ├── news/                 # 뉴스 수집 결과
│   │   ├── content/              # 콘텐츠 결과
│   │   ├── marketing/            # 마케팅 결과
│   │   └── business/             # 비즈니스 결과
│   │
│   ├── state/
│   │   └── workflow-state.json   # 워크플로우 상태
│   │
│   └── logs/
│       └── execution-history.jsonl
│
└── n8n-workflows/                 # n8n 워크플로우 백업
    ├── daily-automation.json
    └── manual-triggers.json
```

---

## Core Components

### 1. Agent Configuration (config/agents.ts)

```typescript
export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  model: 'sonnet' | 'opus' | 'haiku';
  timeout: number;  // ms
  retries: number;
  outputFormat: 'json' | 'markdown' | 'text';
  dependencies?: string[];  // 의존하는 에이전트 ID
}

export const AGENTS: Record<string, AgentConfig> = {
  'news-collector': {
    id: 'news-collector',
    name: 'remitbuddy-news-collector',
    description: '환율/해외송금 뉴스 수집',
    model: 'sonnet',
    timeout: 5 * 60 * 1000,  // 5분
    retries: 2,
    outputFormat: 'json',
    dependencies: [],
  },

  'content-orchestrator': {
    id: 'content-orchestrator',
    name: 'remitbuddy-content-orchestrator',
    description: '콘텐츠 생성 오케스트레이터',
    model: 'sonnet',
    timeout: 10 * 60 * 1000,  // 10분
    retries: 1,
    outputFormat: 'markdown',
    dependencies: ['news-collector'],
  },

  'marketing-orchestrator': {
    id: 'marketing-orchestrator',
    name: 'remitbuddy-marketing-orchestrator',
    description: '마케팅 오케스트레이터',
    model: 'sonnet',
    timeout: 10 * 60 * 1000,
    retries: 1,
    outputFormat: 'markdown',
    dependencies: ['news-collector'],
  },

  'business-orchestrator': {
    id: 'business-orchestrator',
    name: 'remitbuddy-business-orchestrator',
    description: '비즈니스 오케스트레이터',
    model: 'sonnet',
    timeout: 10 * 60 * 1000,
    retries: 1,
    outputFormat: 'markdown',
    dependencies: ['news-collector'],
  },

  'performance-orchestrator': {
    id: 'performance-orchestrator',
    name: 'remitbuddy-performance-orchestrator',
    description: '퍼포먼스 마케팅 오케스트레이터',
    model: 'sonnet',
    timeout: 10 * 60 * 1000,
    retries: 1,
    outputFormat: 'markdown',
    dependencies: ['news-collector'],
  },
};
```

### 2. Workflow Definition (config/workflows.ts)

```typescript
export interface Workflow {
  id: string;
  name: string;
  description: string;
  schedule?: string;  // cron expression
  steps: WorkflowStep[];
  parallel?: string[][];  // 병렬 실행 그룹
  notifications: {
    slack?: boolean;
    email?: boolean;
    notion?: boolean;
  };
}

export const WORKFLOWS: Record<string, Workflow> = {
  'daily-news-pipeline': {
    id: 'daily-news-pipeline',
    name: '12시간 뉴스 기반 자동화',
    description: '뉴스 수집 후 모든 오케스트레이터에 분배',
    schedule: '0 0,12 * * *',  // 매일 00:00, 12:00

    steps: [
      {
        agentId: 'news-collector',
        prompt: `최신 환율/해외송금 뉴스를 수집해줘. JSON 형식으로 출력.`,
      },
    ],

    parallel: [
      ['content-orchestrator', 'marketing-orchestrator', 'business-orchestrator']
    ],

    notifications: {
      slack: true,
      notion: true,
    },
  },
};
```

### 3. Agent Runner (core/agent-runner.ts)

```typescript
export class AgentRunner {
  async run(agentId: string, prompt: string): Promise<AgentResult> {
    const config = AGENTS[agentId];

    // Claude Code CLI 명령어 구성
    const args = [
      '--print',
      '--dangerously-skip-permissions',
      '--model', config.model,
      '--max-turns', '50',
      prompt
    ];

    // spawn으로 실행
    const process = spawn('claude', args, {
      cwd: this.projectPath,
      env: { ...process.env, ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY },
      shell: true,
    });

    // 결과 수집 및 반환
    // ...
  }
}
```

### 4. Workflow Executor (core/workflow-executor.ts)

```typescript
export class WorkflowExecutor {
  async execute(workflowId: string): Promise<WorkflowResult> {
    const workflow = WORKFLOWS[workflowId];

    // Step 1: 순차 실행 단계
    for (const step of workflow.steps) {
      const result = await this.agentRunner.run(step.agentId, step.prompt);
      context.previousResults[step.agentId] = result;
    }

    // Step 2: 병렬 실행 단계
    if (workflow.parallel) {
      for (const parallelGroup of workflow.parallel) {
        await Promise.allSettled(
          parallelGroup.map(agentId => this.agentRunner.run(agentId, prompt))
        );
      }
    }

    // Step 3: 결과 저장 및 알림
    await this.saveResults(workflow, context, results);
    await this.sendNotifications(workflow, context, results);
  }
}
```

### 5. n8n Webhook Handler (integrations/n8n-webhook.ts)

```typescript
// POST /api/workflow/:workflowId
app.post('/api/workflow/:workflowId', async (req, res) => {
  const { workflowId } = req.params;
  const executor = new WorkflowExecutor(process.env.PROJECT_PATH!);
  const result = await executor.execute(workflowId);
  res.json(result);
});
```

---

## Execution Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          12시간 자동 실행 흐름                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  00:00 / 12:00                                                              │
│       │                                                                     │
│       ▼                                                                     │
│  ┌─────────┐                                                                │
│  │  n8n    │ ─────────── Cron Trigger ───────────┐                         │
│  │ Trigger │                                      │                         │
│  └─────────┘                                      ▼                         │
│                                          ┌──────────────┐                   │
│                                          │ HTTP Request │                   │
│                                          │ POST /api/   │                   │
│                                          │ workflow/    │                   │
│                                          │ daily-news   │                   │
│                                          └──────┬───────┘                   │
│                                                 │                           │
│  ┌──────────────────────────────────────────────▼───────────────────────┐  │
│  │                     Automation Server                                 │  │
│  │                                                                       │  │
│  │   Step 1: News Collection (순차)                                      │  │
│  │   ┌────────────────────────────────────────────────────────────────┐ │  │
│  │   │  $ claude --print "최신 뉴스 수집..."                           │ │  │
│  │   │  → WebSearch 실행                                              │ │  │
│  │   │  → JSON 출력 생성                                              │ │  │
│  │   │  → /data/outputs/news/{timestamp}.json 저장                    │ │  │
│  │   └────────────────────────────────────────────────────────────────┘ │  │
│  │                           │                                          │  │
│  │                           ▼                                          │  │
│  │   Step 2: Parallel Orchestrators (병렬)                              │  │
│  │   ┌────────────────────────────────────────────────────────────────┐ │  │
│  │   │   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐          │ │  │
│  │   │   │   content    │ │  marketing   │ │   business   │          │ │  │
│  │   │   │ orchestrator │ │ orchestrator │ │ orchestrator │          │ │  │
│  │   │   └──────────────┘ └──────────────┘ └──────────────┘          │ │  │
│  │   └────────────────────────────────────────────────────────────────┘ │  │
│  │                              │                                       │  │
│  │                              ▼                                       │  │
│  │   ┌──────────────────────────────────────────────────────────────┐  │  │
│  │   │  Results → File System + Notion + Slack                       │  │  │
│  │   └──────────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Environment Variables

```bash
# Claude API
ANTHROPIC_API_KEY=sk-ant-...

# Project
PROJECT_PATH=/path/to/remitbuddy

# Server
PORT=3001
NODE_ENV=production

# Notion
NOTION_API_KEY=secret_...
NOTION_EXECUTION_LOG_DB=...
NOTION_BLOG_KO_DB=...
NOTION_BLOG_EN_DB=...

# Slack
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
SLACK_BOT_TOKEN=xoxb-...

# Redis (for queue)
REDIS_URL=redis://localhost:6379
```

---

## Server Requirements

| Requirement | Minimum |
|-------------|---------|
| Node.js | v18+ |
| Claude Code CLI | Latest |
| Redis | 6.0+ |
| Memory | 4GB+ |
| Storage | 10GB+ |

---

## Implementation Phases

### Phase 1: Infrastructure
- [ ] `/automation` 디렉토리 및 기본 구조 생성
- [ ] package.json, tsconfig.json 설정

### Phase 2: Core
- [ ] Agent Runner 구현 및 테스트
- [ ] Output Parser 구현

### Phase 3: Workflow
- [ ] Workflow Executor 구현
- [ ] State Manager 구현

### Phase 4: API
- [ ] n8n 웹훅 서버 구현
- [ ] Health check endpoint

### Phase 5: Integrations
- [ ] Notion 연동
- [ ] Slack 연동

### Phase 6: n8n
- [ ] n8n 워크플로우 설정
- [ ] Cron trigger 설정

### Phase 7: Production
- [ ] 테스트 및 모니터링 설정
- [ ] 로깅 및 에러 핸들링

---

## n8n Workflow JSON

### Daily Automation

```json
{
  "name": "RemitBuddy - Daily News Pipeline",
  "nodes": [
    {
      "name": "Cron Trigger",
      "type": "n8n-nodes-base.cron",
      "parameters": {
        "triggerTimes": {
          "item": [
            { "hour": 0, "minute": 0 },
            { "hour": 12, "minute": 0 }
          ]
        }
      }
    },
    {
      "name": "Execute Workflow",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "method": "POST",
        "url": "http://localhost:3001/api/workflow/daily-news-pipeline",
        "options": { "timeout": 900000 }
      }
    }
  ]
}
```

---

## Notes

- 이 설계는 현재 `.claude/agents/*.md` 파일들을 그대로 활용합니다
- Claude Code CLI의 `--print` 모드를 사용하여 비대화형 실행
- 에이전트 간 데이터 공유는 파일 시스템과 Notion을 통해 이루어집니다
- 실패 시 재시도 로직과 Slack 알림 포함
