<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCharacterStore } from '@/stores/characterStore'

const characterStore = useCharacterStore()
const { searchedProfile, isSearching, errorMessage } = storeToRefs(characterStore)

const searchKeyword = ref('')

const popularCharacters = [
  { rank: 1, name: '대마법사진이', jobName: '소서리스', searchCount: 128 },
  { rank: 2, name: '로아검색예시', jobName: '블레이드', searchCount: 96 },
  { rank: 3, name: '카멘트라이', jobName: '버서커', searchCount: 87 },
  { rank: 4, name: '모코코검색', jobName: '도화가', searchCount: 72 },
  { rank: 5, name: '군단장연습', jobName: '워로드', searchCount: 65 },
  { rank: 6, name: '아크라시아', jobName: '건슬링어', searchCount: 51 },
  { rank: 7, name: '레이드초보', jobName: '바드', searchCount: 44 },
  { rank: 8, name: '숙제끝내자', jobName: '스카우터', searchCount: 39 },
  { rank: 9, name: '니나브좋아', jobName: '슬레이어', searchCount: 32 },
  { rank: 10, name: '강화붙어라', jobName: '기상술사', searchCount: 28 },
]

const handleSearch = async () => {
  const keyword = searchKeyword.value.trim()

  if (!keyword) {
    return
  }

  await characterStore.searchCharacter(keyword)
}

const searchPopularCharacter = async (characterName: string) => {
  searchKeyword.value = characterName
  await characterStore.searchCharacter(characterName)
}
</script>

<template>
  <v-main class="page">
    <v-container class="py-10">
      <v-row class="mb-8">
        <v-col cols="12">
          <div class="hero-card">
            <h1 class="text-h3 font-weight-bold mb-8">LoaTask</h1>

            <v-row>
              <v-col cols="12" md="9">
                <v-text-field
                  v-model="searchKeyword"
                  label="캐릭터명"
                  placeholder="캐릭터명을 입력하세요"
                  variant="solo-filled"
                  rounded="xl"
                  density="comfortable"
                  hide-details
                  clearable
                  prepend-inner-icon="mdi-magnify"
                  @keyup.enter="handleSearch"
                />
              </v-col>

              <v-col cols="12" md="3">
                <v-btn
                  block
                  size="large"
                  rounded="xl"
                  color="blue-lighten-1"
                  class="search-button"
                  :loading="isSearching"
                  :disabled="!searchKeyword.trim()"
                  prepend-icon="mdi-magnify"
                  @click="handleSearch"
                >
                  검색
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>

      <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-6" rounded="xl">
        {{ errorMessage }}
      </v-alert>

      <v-row align="start">
        <v-col cols="12" md="8">
          <v-card v-if="isSearching" rounded="xl" class="content-card">
            <v-skeleton-loader type="image, article" />
          </v-card>

          <v-card v-else-if="searchedProfile" rounded="xl" class="profile-card">
            <div class="profile-header">
              <div>
                <p class="server-name">
                  {{ searchedProfile.serverName }}
                </p>

                <h2 class="character-name">
                  {{ searchedProfile.characterName }}
                </h2>
              </div>

              <v-chip color="blue-lighten-1" variant="tonal" size="large">
                {{ searchedProfile.characterClassName }}
              </v-chip>
            </div>

            <v-row no-gutters>
              <v-col cols="12" md="5">
                <div class="image-wrap">
                  <v-img
                    :src="searchedProfile.characterImage"
                    height="440"
                    cover
                    class="character-image"
                  />
                </div>
              </v-col>

              <v-col cols="12" md="7">
                <v-card-text class="profile-content">
                  <v-row>
                    <v-col cols="12">
                      <v-sheet class="level-box" rounded="xl">
                        <p class="info-label">아이템 레벨</p>

                        <strong class="item-level">
                          {{ searchedProfile.itemAvgLevel }}
                        </strong>
                      </v-sheet>
                    </v-col>

                    <v-col cols="6">
                      <v-sheet class="info-box" rounded="lg">
                        <p class="info-label">원정대 레벨</p>

                        <strong>
                          {{ searchedProfile.expeditionLevel }}
                        </strong>
                      </v-sheet>
                    </v-col>

                    <v-col cols="6">
                      <v-sheet class="info-box" rounded="lg">
                        <p class="info-label">캐릭터 레벨</p>

                        <strong>
                          {{ searchedProfile.characterLevel }}
                        </strong>
                      </v-sheet>
                    </v-col>

                    <v-col cols="6">
                      <v-sheet class="info-box" rounded="lg">
                        <p class="info-label">길드</p>

                        <strong>
                          {{ searchedProfile.guildName || '-' }}
                        </strong>
                      </v-sheet>
                    </v-col>

                    <v-col cols="6">
                      <v-sheet class="info-box" rounded="lg">
                        <p class="info-label">영지</p>

                        <strong>
                          {{ searchedProfile.townName || '-' }}
                        </strong>
                      </v-sheet>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card rounded="xl" class="ranking-card">
            <v-card-title class="ranking-title">
              <span>실시간 검색 순위</span>
              <v-icon color="amber">mdi-trophy</v-icon>
            </v-card-title>

            <v-card-text>
              <v-list bg-color="transparent" class="pa-0">
                <v-list-item
                  v-for="character in popularCharacters"
                  :key="character.rank"
                  class="ranking-item"
                  rounded="lg"
                  @click="searchPopularCharacter(character.name)"
                >
                  <template #prepend>
                    <v-avatar
                      size="32"
                      :color="character.rank <= 3 ? 'amber' : 'blue-grey-darken-3'"
                    >
                      <span class="text-caption font-weight-bold">
                        {{ character.rank }}
                      </span>
                    </v-avatar>
                  </template>

                  <v-list-item-title class="font-weight-bold">
                    {{ character.name }}
                  </v-list-item-title>

                  <v-list-item-subtitle>
                    {{ character.jobName }} · {{ character.searchCount }}회
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(33, 150, 243, 0.18), transparent 32%),
    radial-gradient(circle at top right, rgba(156, 39, 176, 0.12), transparent 28%), #0d1117;
}

.hero-card {
  padding: 40px;
  border-radius: 28px;
  background: linear-gradient(135deg, rgba(23, 28, 38, 0.96), rgba(13, 17, 23, 0.96));
  border: 1px solid #263246;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
}

.search-button {
  height: 56px;
  font-weight: 700;
}

.content-card,
.profile-card,
.ranking-card {
  overflow: hidden;
  background: rgba(23, 28, 38, 0.94);
  border: 1px solid #263246;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.28);
}

.profile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 28px 32px;
  border-bottom: 1px solid #263246;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.85), rgba(15, 23, 42, 0.9));
}

.server-name {
  margin-bottom: 6px;
  color: #64b5f6;
  font-size: 13px;
  font-weight: 700;
}

.character-name {
  font-size: 32px;
  font-weight: 800;
  line-height: 1.2;
}

.image-wrap {
  height: 100%;
  background: linear-gradient(180deg, rgba(13, 17, 23, 0), rgba(13, 17, 23, 0.8)), #10131a;
}

.character-image {
  background: #10131a;
}

.profile-content {
  padding: 28px;
}

.level-box {
  padding: 20px;
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.18), rgba(13, 17, 23, 0.95));
  border: 1px solid rgba(100, 181, 246, 0.35);
}

.item-level {
  display: block;
  margin-top: 4px;
  color: #90caf9;
  font-size: 30px;
  line-height: 1.2;
}

.info-box {
  min-height: 92px;
  padding: 16px;
  background: rgba(13, 17, 23, 0.92);
  border: 1px solid #263246;
}

.info-label {
  margin-bottom: 8px;
  color: #9ca3af;
  font-size: 12px;
  font-weight: 700;
}

.ranking-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 8px;
  font-weight: 800;
}

.ranking-item {
  margin-bottom: 8px;
  cursor: pointer;
  transition: 0.2s ease;
}

.ranking-item:hover {
  background: rgba(66, 165, 245, 0.12);
  transform: translateX(4px);
}

@media (max-width: 960px) {
  .hero-card {
    padding: 28px;
  }

  .profile-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .character-name {
    font-size: 28px;
  }
}
</style>
