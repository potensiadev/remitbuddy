# RemitBuddy Google Analytics MCP Server

Google Search Console(GSC)과 Google Analytics 4(GA4) 데이터를 Claude Code에서 직접 조회할 수 있는 MCP 서버입니다.

## 설치

```bash
cd mcp-servers/google-analytics
pip install -r requirements.txt
```

## 설정

### 1. 환경 변수 (.env)

프로젝트 루트의 `.env` 파일에 다음 설정이 필요합니다:

```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_API_KEY=your_api_key
GSC_SITE_URL=https://www.remitbuddy.com
GA4_PROPERTY_ID=your_ga4_property_id
```

### 2. GA4 Property ID 확인 방법

1. Google Analytics에 접속
2. 관리(Admin) → 속성(Property) 선택
3. 속성 설정에서 Property ID 확인 (숫자)

### 3. Claude Code MCP 설정

`~/.claude/settings.json`에 추가:

```json
{
  "mcpServers": {
    "remitbuddy-analytics": {
      "command": "python",
      "args": ["D:/remitbuddy/mcp-servers/google-analytics/server.py"],
      "env": {
        "PYTHONPATH": "D:/remitbuddy"
      }
    }
  }
}
```

## 사용 가능한 도구

### Google Search Console

| 도구 | 설명 |
|-----|------|
| `gsc_get_search_queries` | 검색 쿼리별 클릭/노출/CTR/순위 |
| `gsc_get_page_performance` | 페이지별 성과 데이터 |
| `gsc_get_queries_by_page` | 특정 페이지의 검색 쿼리 |
| `gsc_get_country_performance` | 국가별 검색 성과 |

### Google Analytics 4

| 도구 | 설명 |
|-----|------|
| `ga4_get_traffic_overview` | 전체 트래픽 요약 |
| `ga4_get_traffic_by_country` | 국가별 트래픽 |
| `ga4_get_top_pages` | 상위 페이지 |
| `ga4_get_events` | 이벤트 데이터 |
| `ga4_get_currency_events` | 통화 선택 이벤트 |

### 통합 분석

| 도구 | 설명 |
|-----|------|
| `get_content_insights` | GSC + GA4 데이터 기반 콘텐츠 인사이트 |

## 첫 실행 시 OAuth 인증

처음 실행하면 브라우저에서 Google 로그인 화면이 열립니다:

1. Google 계정으로 로그인
2. GSC/GA4 접근 권한 승인
3. 토큰이 `token.json`에 저장됨 (이후 자동 인증)

## 예시 사용법

Claude Code에서:

```
"이번 주 검색 쿼리 분석해줘"
→ gsc_get_search_queries(days=7)

"블로그 페이지 CTR 확인해줘"
→ gsc_get_page_performance(days=7)

"콘텐츠 전략 인사이트 줘"
→ get_content_insights()
```
