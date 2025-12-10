# Google Analytics 4 설정 가이드

이 프로젝트에 포함된 GA4 이벤트(`clicked_cta`, `results_impression`, `results_scroll`, `clicked_provider`)를 정확히 수집하려면 아래 단계를 따라 주세요.

## 1) 측정 ID 연결
1. GA4 속성에서 **데이터 스트림 > 웹**으로 이동해 `측정 ID`(예: `G-XXXXXXX`)를 확인합니다.
2. 프로젝트의 환경 변수에 `NEXT_PUBLIC_GA_MEASUREMENT_ID`를 추가합니다.
   - 로컬: `.env.local` 파일에 `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXX`
   - 배포: 호스팅 환경의 환경 변수에 동일한 키/값을 설정
3. 배포 후 **실시간** 또는 **DebugView**에서 페이지가 로드될 때 GA 요청이 들어오는지 확인합니다.

## 2) 기본 이벤트 파라미터 매핑
코드에서 전송하는 주요 파라미터를 커스텀 차원/지표로 등록해야 GA4 보고서에서 필터/세그먼트로 활용할 수 있습니다. 경로: **관리(Admin) > 데이터 표시 > 커스텀 정의 > 커스텀 차원/지표 생성**.

| 권장 타입 | 파라미터 이름 | 설명 |
| --- | --- | --- |
| 차원 | `receiving_country` | 사용자가 선택한 수취 국가 (예: `VN`, `NP`) |
| 차원 | `transfer_currency` | 수취 통화 코드 |
| 차원 | `amount_range` | 송금액 구간 (0-100k, 100k-500k 등) |
| 지표 | `transfer_amount_value` | 입력한 송금액(정수) |
| 차원 | `provider` | 클릭한 사업자 이름 |
| 차원 | `rank` | 결과 리스트에서 순위(1부터 시작) |
| 차원 | `is_top_provider` | 1위 사업자 클릭 여부(boolean) |
| 차원 | `provider_count` | 비교 결과에 노출된 사업자 수 |
| 차원 | `best_provider` | 스크롤 이벤트 시 상단 사업자 이름 |
| 차원 | `scroll_position` | 결과 영역에서의 스크롤 위치(px) |
| 차원 | `session_duration_range` | 세션 체류 시간 구간 |

> **TIP:** 필터 이름은 코드에서 사용하는 파라미터 이름과 정확히 일치해야 합니다.

## 3) 전환(Conversion) 설정
1. **구성 > 이벤트**에서 자동 수집된 이벤트 목록을 확인합니다.
2. 아래 이벤트를 찾아 전환 스위치를 켭니다.
   - `clicked_cta` (최저 환율 비교 CTA 제출)
   - `clicked_provider` (송금하러가기 클릭)
3. 필요 시 `results_impression` 또는 `results_scroll`을 전환으로 추가해 결과 확인/몰입도를 측정할 수 있습니다.

## 4) 디버깅 & 검증
1. 로컬 또는 스테이징에서 브라우저 콘솔을 열면 `📊 Event logged:` 로그와 함께 전송되는 파라미터를 확인할 수 있습니다.
2. GA4 **DebugView**에서 동일한 이벤트가 들어오는지 확인하세요.
3. 실시간 보고서에서 `사용자 > 이벤트 이름`을 필터링하여 파라미터 값(국가, 금액, 순위 등)이 기대와 일치하는지 점검합니다.

## 5) 커스텀 탐색(보고서) 예시
- **여정 분석:** 시작 이벤트 `clicked_cta` → `results_impression` → `clicked_provider` 흐름을 경로 탐색으로 구성합니다.
- **순위별 성과:** `clicked_provider` 이벤트를 기준으로 차원 `rank`와 `is_top_provider`로 분할하여 1위 vs. 나머지 클릭률을 비교합니다.
- **금액/국가 세그먼트:** `receiving_country`와 `amount_range`를 세그먼트로 묶어 국가·금액대별 결과 노출(`results_impression`) 대비 클릭(`clicked_provider`) 비율을 비교합니다.

## 6) 주의 사항
- 브라우저에서 광고 차단기(Ad-blocker)가 켜져 있으면 이벤트가 차단될 수 있으니 테스트 시 비활성화하세요.
- SPA 특성상 페이지 이동 없이 이벤트가 발생하므로, `send_page_view: false` 설정 이후 페이지뷰 수집이 필요하면 수동 `gtag('event', 'page_view')` 호출을 추가로 고려하세요.

