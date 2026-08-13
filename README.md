<p align="center">
  <img src="docs/images/loatask.png" width="420" />
</p>

# LoaTask

로스트아크 캐릭터 정보를 검색할 수 있는 웹 서비스입니다.

캐릭터명을 입력하면 Lost Ark Open API에서 프로필 정보를 조회해 화면에 보여줍니다. 현재는 캐릭터 검색 관련 기능을 위주로 개발하고 있으며, 이후 실시간 검색 순위, 커뮤니티 게시판, 챗봇 기능 등 다른 기능들 또한 차례로 추가할 예정입니다.

## 프로젝트의 목표

- Spring Boot 기반 REST API 개발
- MySQL과 JPA를 활용한 데이터 저장
- Lost Ark Open API 연동
- 외부 API 응답 DTO 매핑
- Vue.js와 Vuetify, Chart.js 등 라이브러리를 활용한 화면 UI 구현
- 캐릭터 검색 서비스 구조 설계
- 검색 순위, 커뮤니티, 챗봇 기능 등 확장 예정

## 기술 스택

### Backend

- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- MySQL
- Lombok
- RestClient

### Frontend

- Vue 3
- TypeScript
- Axios
- Pinia
- Vue Router
- Vuetify
- Chart.js

### Tools

- IntelliJ IDEA
- VSCode
- MySQL Workbench
- Git / GitHub
- Lost Ark Open API
- OpenAI API

## 주요 기능

### 구현 완료

- 로스트아크 프로젝트 상태 확인 API
- 캐릭터 등록 API
- 캐릭터 목록 조회 API
- 캐릭터 상세 조회 API
- 캐릭터 수정 API
- 캐릭터 삭제 API
- 로스트아크 공식 API 캐릭터 프로필 조회
- 공식 API로 조회한 캐릭터 정보를 DB에 저장하는 기능
- Vue.js 프로젝트 구성
- Vuetify 기반 메인 화면 구성
- 캐릭터 검색 API 프론트 연동 구조 추가

### 구현 중

- 캐릭터명 기반 실시간 검색 화면
- 검색 결과 카드 UI
- 서버, 직업, 아이템 레벨, 원정대 레벨, 길드, 영지 정보 표시
- 실시간 검색 순위 UI

### 구현 예정

- 검색 기록 저장 및 집계
- 실시간 검색 순위 TOP 10 API
- 검색 순위 데이터 프론트 연동
- 검색한 캐릭터 즐겨찾기 저장
- 커뮤니티 게시판
- 게시글 작성, 조회, 수정, 삭제
- 캐릭터 정보 기반 챗봇
- 주간 숙제 체크 기능
- 원정대 대시보드
