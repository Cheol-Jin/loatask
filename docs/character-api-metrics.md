# 캐릭터 API 운영 지표

## 수집 구조

- `CharacterApiMetrics`: PROFILE(검색 기본 프로필), ARMORY(상세 화면), ROSTER(원정대 목록)별 카운터와 평균/최대 시간을 메모리에 집계합니다.
- `CharacterResponseCache`: 조회 시작·종료, 처음 캐시 확인 시 적중/미적중, 동시 요청 병합, 이전 응답 반환을 기록합니다.
- `LostArkOpenApiClient`: 실제 외부 호출 시간과 공식 응답 결과를 기록합니다. 실패가 캐시로 가려져도 외부 오류 집계는 남습니다.
- `CharacterMetricsLogConfig`: 서버 시작 60초 후부터 60초 간격으로 종류별 누적 지표 세 줄을 INFO 로그로 출력합니다.

캐릭터명·조회 URL·인증 정보·원문 오류는 기록하지 않습니다. 공개 관리 API나 지표 초기화 API를 추가하지 않았습니다. 종류가 세 개로 고정돼 사용자 수에 따라 지표 메모리가 늘지 않습니다. DB나 별도 모니터링 서버는 필요하지 않습니다.

## 로그 읽기

Render의 기존 서비스 **Logs** 화면에서 `CHARACTER_API_METRICS`를 검색합니다. 해당 배포가 Live가 된 뒤 서버가 요청을 처리하고 1분 이상 실행돼야 결과가 남습니다.

| 필드 | 의미 |
| --- | --- |
| kind / startedAt | 요청 종류 / 이 프로세스 집계 시작 시각 |
| requests / completed | 유효한 이름으로 캐시 조회를 시작한 횟수 / 반환 또는 오류로 종료된 횟수 |
| cacheHits / cacheMisses | 최초 캐시 확인에서 바로 재사용한 횟수 / 갱신이 필요했던 횟수 |
| hitRatePercent | cacheHits ÷ (cacheHits + cacheMisses) × 100 |
| coalesced | 미적중했지만 같은 캐릭터의 진행 중인 갱신을 기다린 횟수 |
| staleResponses | 정상 유효기간(60초)이 지난 이전 데이터를 사용자에게 반환한 횟수. 병합 요청 각각 포함 |
| failedRequests | 캐시 조회가 최종 오류로 종료된 횟수. 이전 응답으로 복구된 요청은 제외 |
| requestMeanMs / requestMaxMs | 캐시 조회 처리 시간의 평균/최대. 외부 호출과 병합 대기 포함, 컨트롤러 DB 집계와 네트워크·화면 렌더링은 제외 |
| upstreamCalls / upstreamMeanMs / upstreamMaxMs | 종료된 외부 호출 시도 횟수 / 평균 / 최대 시간. HTTP 응답 역직렬화와 기본 응답 검증 포함 |
| upstreamSuccesses | 유효한 프로필을 읽은 외부 호출 수 |
| rateLimited | 공식 API가 429를 반환한 횟수 (사용자 응답 503과 구분) |
| serverErrors | 공식 API의 5xx 횟수 |
| httpErrors | 429·5xx 외의 HTTP 오류(404·401·403 등) 횟수 |
| connectionErrors | 연결·타임아웃 등 HTTP 응답을 얻지 못한 오류 횟수 |
| invalidResponses | JSON 변환 실패나 유효한 프로필 없는 응답 횟수 |

재호출 유예 중 이전 응답을 즉시 반환하면 cacheHits와 staleResponses 모두 증가합니다. 따라서 적중률이 높아도 staleResponses가 증가한다면 외부 API 장애가 있는지 같이 확인해야 합니다. cacheMisses에는 병합 요청도 포함되므로 upstreamCalls와 같지 않습니다. 진행 중인 요청은 시작/종료 지표의 반영 시점이 달라 잠깐 합계가 맞지 않을 수 있습니다.

누적 평균·최대만 보관하며 p95를 추정하지 않습니다. 프로세스 종료 시 집계는 사라지지만 이미 출력된 로그는 서비스의 로그 보존 정책을 따릅니다. 재배포·재시작·여러 인스턴스의 로그를 하나의 누적 시계열처럼 섞지 마세요. Render 로그의 인스턴스와 startedAt을 함께 구분해야 합니다.

## 운영에서 비교하기

1. 같은 인스턴스·startedAt·kind의 시작 로그(A)를 저장합니다. 다른 사용자의 트래픽이 적은 시간에 진행하면 비교가 쉽습니다.
2. 캐릭터 하나를 60초 이내에 20번 조회하고, 요청이 모두 끝난 뒤 다음 로그(B)를 저장합니다. 검색 화면은 기본 프로필과 순위 조회를 함께 보내므로 여기의 PROFILE 지표는 프로필 호출만 셉니다.
3. 평소 보유한 서로 다른 캐릭터 20개를 각각 조회하는 별도 구간도 같은 방법으로 기록합니다. 비교를 위해 없는 이름이나 대량의 임의 이름을 호출할 필요는 없습니다.
4. B-A로 requests, cacheHits, cacheMisses, upstreamCalls, staleResponses, 각 오류의 구간 증가량을 비교합니다.
5. 구간 적중률 = ΔcacheHits / (ΔcacheHits + ΔcacheMisses). 구간 평균 시간 ≈ (B평균×B완료수 - A평균×A완료수) / Δ완료수. 외부 평균은 upstreamCalls를 사용합니다. 로그 반올림 오차가 있으므로 근사치입니다. 누적 최대값의 차이로 구간 최대를 계산할 수는 없습니다.
6. 시작부터 캐시가 있으면 외부 호출 0회도 가능합니다. 캐시 만료, 다른 사용자 조회, 서버 재시작에 따라 결과가 달라집니다.

운영 측정은 실제 캐릭터 조회이므로 기존처럼 검색 횟수가 증가합니다. 운영 DB를 초기화하거나 API 장애를 고의로 만들지 않습니다. 장애 처리는 모의 API로 검증합니다.

## 로컬 재현

```sh
./gradlew test --tests '*CharacterApiMetricsTests' --rerun-tasks --no-daemon
```

Gradle 테스트 보고서에서 `METRICS_COMPARISON`으로 시작하는 출력을 확인합니다. 반복 캐릭터와 서로 다른 캐릭터를 각각 20번 순차 조회하고, 모의 외부 응답에 40ms 지연을 줍니다. 이는 운영 수치가 아니며 DB·브라우저·실제 인터넷 지연을 포함하지 않습니다.

## 이번 측정 결과

| 조건 | 조회 | 적중 | 외부 호출 | 클라이언트 평균 | 외부 평균 |
| --- | ---: | ---: | ---: | ---: | ---: |
| 같은 캐릭터 반복 | 20 | 19 | 1 | 3.063ms | 60.117ms |
| 서로 다른 캐릭터 | 20 | 0 | 20 | 47.947ms | 47.904ms |

2026-11-12 모의 API 테스트에서 수집한 지표입니다. 최초 호출도 포함합니다. 실제 운영 트래픽 비교는 아직 수행하지 않았습니다.
