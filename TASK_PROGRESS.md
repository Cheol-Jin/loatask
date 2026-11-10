# 작업 진행 기록

마지막 갱신: 2026-11-06 (한국 시간)

## 작업 원칙

- 시작 전에 사용량을 조회할 수 있으면 확인하고, 불가능하면 조회 불가능하다고 알립니다. 잔액을 추측하지 않습니다.
- 작은 단계별로 파일을 저장하고 관련 검증을 진행합니다. 불필요한 탐색과 중복 테스트는 최소화합니다.
- 사용량 부족 또는 중단 위험이 감지되면 새 기능 추가를 멈추고 이 기록에 현재 변경과 다음 순서를 남깁니다.
- 기존 변경을 초기화하거나 삭제하지 않습니다. 커밋에는 이번 변경만 선별합니다.
- 비밀번호·API 키·환경설정 비밀값·빌드 결과물을 기록하거나 커밋하지 않습니다.
- 사용자는 main에서의 커밋·push를 허용했습니다. force push와 임의의 운영 DB 변경은 금지합니다.

## 현재 위치

- 사용자 원본 프로젝트: `/Users/cheoljin/vue-java-practice`
- 실제 Git 저장소 및 백엔드: `/Users/cheoljin/vue-java-practice/loatask-backend`
- 프론트엔드: `/Users/cheoljin/vue-java-practice/loatask-backend/frontend`
- 브랜치: `main`
- 별도 worktree나 클라우드 작업 공간 없이 원본 폴더를 직접 수정했습니다.
- 원격: `https://github.com/Cheol-Jin/loatask.git`
- 상세 기능 커밋: `c5d8a7f`, 이동 간격 보정: `6ed6505`, 트라이포드 단계 보정: `4a632d5`. 모두 push 완료.

## 반드시 보존할 사용자 변경

- `frontend/src/views/CommunityView.vue`: 사용자가 추가한 scoped `.page` 스타일 7줄이 미커밋 상태입니다.
- `frontend/src/views/HomeView.vue`: 사용자에 의한 로컬 삭제 상태입니다. Git에 있는 파일을 임의 복원하지 않습니다.
- 위 두 변경은 상세정보 기능 커밋에 포함하지 않았습니다.

## 완료한 기능

- 기본 프로필 검색, 검색 순위, 즐겨찾기, 운세 카드 기능.
- 캐릭터 상세 화면에 전투력·전투 특성·성향·스킬 포인트 표시.
- 장비·장신구 이름/등급/품질, 펼쳐 보는 상세 옵션.
- 아크 패시브 각인 및 기존 각인 효과.
- 보석 레벨과 연결된 스킬 효과.
- 장착 카드, 각성 수치, 카드 세트 효과.
- 투자한 스킬(Lv.2 이상), 선택 트라이포드, 룬, 펼쳐 보는 스킬 설명.
- 아크 패시브 포인트와 적용 효과.
- 공식 통합 API를 한 번 호출하는 `GET /api/lostark/official/characters/{characterName}/armory`.
- 공식 API의 PascalCase 응답을 camelCase DTO로 매핑하고 빈 장착 목록을 처리합니다.
- 외부 설명 HTML은 실행하지 않고 텍스트로 표시합니다.
- 항목 이동 시 고정 메뉴 아래로 제목이 보이도록 간격을 확보하고, 트라이포드 단계를 1~3으로 표시합니다.

## 상세정보 기능 수정 파일

백엔드:
- `src/main/java/com/example/vuespringlabbackend/lostark/api/LostArkOpenApiClient.java`
- `src/main/java/com/example/vuespringlabbackend/lostark/controller/LostArkController.java`
- `src/main/java/com/example/vuespringlabbackend/lostark/dto/LostArkArmoryResponse.java`
- `src/main/java/com/example/vuespringlabbackend/lostark/dto/LostArkProfileResponse.java`
- `src/test/java/com/example/vuespringlabbackend/lostark/api/CharacterProfileErrorTests.java`

프론트엔드 및 문서:
- `frontend/src/api/lostarkApi.ts`
- `frontend/src/types/lostark.ts`
- `frontend/src/views/CharacterDetailView.vue`
- `frontend/src/components/CharacterProfile.vue`
- `frontend/src/components/CharacterArmory.vue`
- `frontend/src/components/ArmoryItem.vue`
- `frontend/src/utils/armory.ts`
- `frontend/tests/armory.test.mjs`
- `README.md`

## 배포 및 이전 검증

- 프론트엔드: `https://loatask.vercel.app`
- 백엔드: `https://loatask-api.onrender.com`
- DB: Aiven Free MySQL. 꺼져 있으면 사용자가 Power on 후 Running을 확인해야 합니다.
- DB 재시작 및 Render 재시작으로 이전 DB 연결 장애를 복구했습니다.
- `c69a451`에서 Java 기본 공인 인증서를 유지한 채 Aiven CA를 추가하도록 수정해 공식 API TLS 연결 오류를 해결했습니다.
- 이전 작업에서 상세 기능의 Render Live와 Vercel 화면 반영을 확인했습니다.
- 실제 `대마법사진이`의 장비 17개, 각인 5개, 보석 11개, 카드 6개, 스킬 및 아크 패시브를 확인했습니다.
- 장비 옵션 펼치기, 스킬 룬·트라이포드 1~3단계, 좁은 화면(527px) 가로 넘침 없음 확인.
- 모든 캐릭터·모든 기기의 동작을 검증한 것은 아닙니다.

## 현재 재개 작업

- [x] 절대 경로, Git 브랜치, worktree와 기존 변경 확인.
- [x] 사용량 조회: 추가 크레딧 0, 플랜 기본 사용 가능. 확인 시 5시간 사용 1%, 주간 사용 16%. 이는 현재 잔액을 보장하는 고정값이 아닙니다.
- [x] 진행 기록 파일 생성.
- [x] 재개 후 백엔드 빌드·테스트 최종 실행: 빌드 성공, 캐시 없이 테스트 24개 통과.
- [x] 재개 후 프론트엔드 빌드·테스트 최종 실행: 타입 검사 및 빌드 성공, 테스트 14개 통과.
- [x] 최종 결과 기록. 이 문서만 선별 커밋·push 대상으로 지정했습니다. 전송 결과는 Git 로그와 원격 상태로 확인합니다.

## 미구현 범위 (기존 상세 작업의 오류가 아닌 후속 기능)

- 로아와와 동일한 전체 서비스, 자체 딜 계산·캐릭터 성능 순위.
- 아크 그리드, 아바타·수집품 상세, 원정대 다른 캐릭터 목록.
- 커뮤니티 게시판, 챗봇, 운세 고민 AI 해석, 주간 숙제 체크.
- 기존 요청은 장비 등 상세정보 표시였으며 위 후속 기능을 이번 재개에서 추가하지 않습니다.

## 다음 진행 순서와 실행 방법

1. 이 파일과 `git status --short --branch`를 확인해 다른 사용자의 변경을 보존합니다.
2. 중단 당시 체크되지 않은 검증만 이어서 실행하고 아래 결과를 갱신합니다.
3. 사이트에서 캐릭터 검색 → **상세 보기**를 선택합니다. 원하는 항목으로 이동하거나 장비·보석·스킬을 눌러 설명을 펼칩니다.
4. 원본 프로젝트에 이미 직접 반영되어 있으므로 복사·병합이 필요 없습니다. 다른 PC는 로컬 변경을 먼저 보존한 뒤 원격 main을 받아야 합니다.

백엔드(저장소 루트): `./gradlew build --no-daemon`

프론트엔드(frontend 폴더, 기본 Node 20 대신 Node 24 사용):

```sh
npm exec --yes --package=node@24 --call 'npm run build && node --test tests/*.test.mjs'
```

테스트는 별도 H2 메모리 DB를 사용합니다. 운영 DB에 직접 테스트하지 않습니다.

## 재개 후 최종 검증 결과

- 프론트엔드: Node 24로 타입 검사 및 프로덕션 빌드 성공, 테스트 14개 통과.
- 백엔드: `./gradlew build --no-daemon` 성공. 이어서 `./gradlew test --rerun-tasks --no-daemon`으로 캐시 없이 테스트 24개를 실제 실행했고 모두 통과했습니다. 별도 H2 메모리 DB를 사용했으며 운영 DB에서 실행하지 않았습니다.
- 이번 재개에서는 애플리케이션 소스 수정 없이 진행 기록을 추가했습니다.
- 이번 재개에서는 실서비스를 다시 호출하지 않았습니다. 위 실제 화면 확인은 이전 작업에서 수행한 검증입니다.

## 보안 주의 사항

로컬 `src/main/resources/application.properties`는 Git 추적에서 제거했지만 이전 Git 기록에 실제 인증 정보가 포함됐던 이력이 있습니다. 기존 키 폐기·교체를 안내했으며 교체 완료 여부는 확인하지 않았습니다. 비밀값을 이 파일이나 채팅에 적지 않습니다. 이 파일의 검증 명령은 비밀값을 출력하거나 운영 DB를 변경하기 위한 명령이 아닙니다.

## 2026-11-11: 외부 API 호출 최적화

- 시작 확인: 원본 저장소 main, 추가 worktree 없음. 사용자 변경 두 건 보존.
- 사용량 조회: 추가 크레딧 0, 기본 사용 가능, 5시간 2% / 주간 43% 사용.
- 완료: 기본 프로필·상세정보 메모리 캐시, 60초 만료, 일시 장애 시 최대 10분 이내 마지막 성공 응답, 동일 키 동시 요청 병합.
- 수정: `CharacterResponseCache.java` 신규; `LostArkOpenApiClient.java`, `CharacterProfileException.java`에 캐시 적용 및 일시 오류 구분.
- 검증: `CharacterProfileErrorTests.java`, `CharacterResponseCacheTests.java`, `CharacterCacheMeasurementTests.java`. 백엔드 빌드 성공, 테스트 33개 통과. 프론트 소스는 변경하지 않아 빌드를 반복하지 않음.
- 결과: 20회 반복 조회에서 외부 호출 20→1회, 평균 87.848→5.547ms. 모의 지연 조건이며 운영 성능 수치가 아님.
- 문서: README와 `docs/character-cache.md`에 정책·측정·재현 명령 기록.
- 다음: 운영 지표가 필요해지면 요청 유형별 적중률·공식 API 429·응답 시간을 측정하고, 여러 인스턴스에서 캐시를 공유할 필요가 있는지 판단.
