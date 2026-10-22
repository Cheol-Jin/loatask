<script setup lang="ts">
import { onMounted, ref } from 'vue'
import CharacterProfile from '@/components/CharacterProfile.vue'
import FavoriteButton from '@/components/FavoriteButton.vue'
import { useFavoriteStore } from '@/stores/favoriteStore'
import { storeToRefs } from 'pinia'
import { useCharacterStore } from '@/stores/characterStore'
import { getSearchRankings } from '@/api/lostarkApi'
import { useRoute, useRouter } from 'vue-router'
import type { CharacterSearchRanking } from '@/types/lostark'
const router = useRouter()
const route = useRoute()

const favorites = useFavoriteStore()
const characterStore = useCharacterStore()
const { searchedProfile, isSearching, errorMessage } = storeToRefs(characterStore)

const searchKeyword = ref<string | null>('')

const popularCharacters = ref<CharacterSearchRanking[]>([])
const rankingError = ref(false)

const fetchSearchRankings = async () => {
  rankingError.value = false
  try {
    popularCharacters.value = await getSearchRankings()
  } catch {
    rankingError.value = true
  }
}

onMounted(async () => {
  const character = route.query.character
  if (typeof character === 'string' && character.trim()) {
    searchKeyword.value = character.trim()
    await characterStore.searchCharacter(searchKeyword.value)
  }
  await fetchSearchRankings()
})

const goDetail = () => {
  if (!searchedProfile.value) return

  router.push({
    name: 'characterDetail',
    params: {
      name: searchedProfile.value.characterName,
    },
  })
}

const handleSearch = async () => {
  const keyword = searchKeyword.value?.trim()

  if (!keyword) {
    return
  }

  await router.replace({
    query: {
      character: keyword,
    },
  })

  await characterStore.searchCharacter(keyword)
  await fetchSearchRankings()
}

const searchPopularCharacter = async (characterName: string) => {
  searchKeyword.value = characterName
  await handleSearch()
}
</script>

<template>
  <v-main>
    <v-container class="page-shell">
      <header class="page-heading">
        <h1>캐릭터 검색</h1>
        <p>캐릭터의 기본 정보와 성장 현황을 확인하세요.</p>
      </header>
      <form class="search-form" @submit.prevent="handleSearch">
        <v-text-field
          v-model="searchKeyword"
          label="캐릭터명"
          placeholder="캐릭터명을 입력하세요"
          variant="outlined"
          density="comfortable"
          hide-details
          clearable
        />
        <v-btn
          type="submit"
          class="search-button"
          color="primary"
          :loading="isSearching"
          :disabled="!searchKeyword?.trim()"
          >검색</v-btn
        >
      </form>
      <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-6">{{
        errorMessage
      }}</v-alert>
      <v-alert
        v-if="favorites.storageMessage"
        type="warning"
        variant="tonal"
        class="mb-6"
        role="status"
        >{{ favorites.storageMessage }}</v-alert
      >
      <div class="search-layout">
        <section aria-label="검색 결과" :aria-busy="isSearching">
          <div class="section-heading result-heading">
            <h2>검색 결과</h2>
            <span>기본 프로필</span>
          </div>
          <v-skeleton-loader
            v-if="isSearching"
            type="image, article"
            aria-label="캐릭터 정보 조회 중"
          />
          <CharacterProfile v-else-if="searchedProfile" :profile="searchedProfile">
            <FavoriteButton :character-name="searchedProfile.characterName" />
            <v-btn variant="outlined" @click="goDetail">상세 보기</v-btn>
          </CharacterProfile>
          <div v-else class="search-empty">
            <h2>{{ errorMessage ? '검색 결과가 없습니다.' : '어떤 캐릭터를 찾으시나요?' }}</h2>
            <p>
              {{
                errorMessage
                  ? '캐릭터명을 확인하거나 잠시 후 다시 검색해 주세요.'
                  : '상단에 캐릭터명을 입력해 주세요.'
              }}
            </p>
            <p class="search-hint">서버 · 직업 · 아이템 레벨 · 원정대 · 길드</p>
          </div>
        </section>
        <aside class="sidebar">
          <section aria-label="즐겨찾기 목록">
            <div class="section-heading">
              <h2>
                즐겨찾기 <span class="favorite-count">{{ favorites.names.length }}</span>
              </h2>
              <span>이 브라우저에 저장</span>
            </div>
            <p v-if="!favorites.names.length" class="empty-note">
              자주 찾는 캐릭터를 저장해 보세요.<br />검색 결과에서 별 버튼으로 추가할 수 있습니다.
            </p>
            <ul v-else class="favorite-list">
              <li v-for="name in favorites.names" :key="name">
                <button
                  class="favorite-name"
                  :aria-label="`${name} 검색`"
                  @click="searchPopularCharacter(name)"
                >
                  {{ name }}
                </button>
                <button
                  class="remove-favorite"
                  :aria-label="`${name} 즐겨찾기 해제`"
                  @click="favorites.toggle(name)"
                >
                  <v-icon size="18">mdi-star</v-icon>
                </button>
              </li>
            </ul>
          </section>
          <section aria-label="누적 검색 순위">
            <div class="section-heading">
              <h2>누적 검색 순위</h2>
              <span>TOP 10</span>
            </div>
            <p v-if="rankingError" class="empty-note">
              순위를 불러오지 못했습니다.
              <button class="retry-ranking" @click="fetchSearchRankings">다시 시도</button>
            </p>
            <p v-else-if="!popularCharacters.length" class="empty-note">
              아직 집계된 검색이 없습니다.
            </p>
            <ol v-else class="ranking-list">
              <li v-for="(character, index) in popularCharacters" :key="character.characterName">
                <button @click="searchPopularCharacter(character.characterName)">
                  <span class="rank" :class="{ 'top-rank': index < 3 }">{{
                    String(index + 1).padStart(2, '0')
                  }}</span>
                  <span class="rank-name">{{ character.characterName }}</span>
                  <span class="rank-count">{{ character.searchCount.toLocaleString() }}회</span>
                </button>
              </li>
            </ol>
            <p class="ranking-note">전체 누적 검색 횟수 기준입니다.</p>
          </section>
        </aside>
      </div>
    </v-container>
  </v-main>
</template>

<style scoped>
.search-form {
  display: flex;
  gap: 12px;
  max-width: 760px;
  margin-bottom: 40px;
}
.search-button {
  height: 48px;
  min-width: 96px;
  font-weight: 700;
}
.search-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 40px;
  align-items: start;
}
.result-heading {
  margin-bottom: 20px;
}
.search-empty {
  min-height: 350px;
  border-bottom: 1px solid var(--line);
  padding: 64px 0;
}
.search-empty h2 {
  font-size: 22px;
  font-weight: 500;
  letter-spacing: -0.5px;
}
.search-empty p {
  margin-top: 12px;
  color: var(--muted);
  font-size: 14px;
}
.search-empty .search-hint {
  margin-top: 40px;
  font-size: 12px;
}
.sidebar {
  display: grid;
  gap: 36px;
}
.favorite-count {
  margin-left: 6px;
  color: var(--accent);
}
.favorite-list,
.ranking-list {
  list-style: none;
  padding: 0;
}
.favorite-list li {
  display: flex;
  border-bottom: 1px solid var(--line);
}
.favorite-name {
  text-align: left;
  flex: 1;
  padding: 12px 0;
  overflow-wrap: anywhere;
  min-width: 0;
  font-size: 13px;
}
.remove-favorite {
  color: var(--accent);
  flex-shrink: 0;
  width: 40px;
  min-height: 44px;
}
.ranking-list button {
  display: flex;
  gap: 14px;
  width: 100%;
  align-items: center;
  padding: 13px 0;
  border-bottom: 1px solid var(--line);
  text-align: left;
  font-size: 13px;
}
.ranking-list button:hover,
.favorite-name:hover {
  background: #1c1c1c;
}
.rank {
  font-variant-numeric: tabular-nums;
  color: var(--muted);
  font-size: 12px;
}
.top-rank {
  color: var(--accent);
}
.rank-name {
  flex: 1;
  overflow-wrap: anywhere;
  min-width: 0;
}
.rank-count {
  color: var(--muted);
  font-size: 12px;
  white-space: nowrap;
}
.ranking-note {
  margin-top: 14px;
  color: var(--muted);
  font-size: 11px;
}
.retry-ranking {
  text-decoration: underline;
  color: var(--text);
}
@media (max-width: 960px) {
  .search-layout {
    grid-template-columns: minmax(0, 1fr);
    gap: 32px;
  }
  .sidebar {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 28px;
  }
}
@media (max-width: 600px) {
  .search-form {
    gap: 8px;
    margin-bottom: 28px;
  }
  .search-button {
    min-width: 72px;
  }
  .sidebar {
    grid-template-columns: 1fr;
  }
  .search-empty {
    min-height: 240px;
    padding-top: 36px;
  }
}
</style>
