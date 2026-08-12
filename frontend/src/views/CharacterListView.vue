<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCharacterStore } from '@/stores/characterStore'

const characterStore = useCharacterStore()
const { searchedProfile, isSearching, errorMessage } = storeToRefs(characterStore)

const searchKeyword = ref('')

const popularCharacters = [
  { rank: 1, name: '대마법사진이', jobName: '소서리스', searchCount: 128 },
  { rank: 2, name: '로아검색', jobName: '블레이드', searchCount: 96 },
  { rank: 3, name: '카멘', jobName: '버서커', searchCount: 87 },
  { rank: 4, name: '모코코', jobName: '도화가', searchCount: 72 },
  { rank: 5, name: '군단장', jobName: '워로드', searchCount: 65 },
  { rank: 6, name: '아크라시아', jobName: '건슬링어', searchCount: 51 },
  { rank: 7, name: '레이드', jobName: '바드', searchCount: 44 },
  { rank: 8, name: '숙제', jobName: '스카우터', searchCount: 39 },
  { rank: 9, name: '니나브', jobName: '슬레이어', searchCount: 32 },
  { rank: 10, name: '샨디', jobName: '기상술사', searchCount: 28 },
]

const handleSearch = async () => {
  await characterStore.searchCharacter(searchKeyword.value)
}

const searchPopularCharacter = async (characterName: string) => {
  searchKeyword.value = characterName
  await characterStore.searchCharacter(characterName)
}
</script>

<template>
  <v-app>
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

        <v-row>
          <v-col cols="12" md="8">
            <v-card v-if="isSearching" rounded="xl" class="content-card">
              <v-skeleton-loader type="image, article" />
            </v-card>

            <v-card v-else-if="searchedProfile" rounded="xl" class="profile-card">
              <v-row no-gutters>
                <v-col cols="12" md="5">
                  <v-img
                    :src="searchedProfile.characterImage"
                    height="420"
                    cover
                    class="character-image"
                  />
                </v-col>

                <v-col cols="12" md="7">
                  <v-card-text class="pa-8">
                    <div class="d-flex align-center justify-space-between mb-4">
                      <div>
                        <p class="text-caption text-blue-lighten-2 mb-1">
                          {{ searchedProfile.serverName }}
                        </p>

                        <h2 class="text-h4 font-weight-bold">
                          {{ searchedProfile.characterName }}
                        </h2>
                      </div>

                      <v-chip color="blue-lighten-1" variant="tonal">
                        {{ searchedProfile.characterClassName }}
                      </v-chip>
                    </div>

                    <v-divider class="my-6" />

                    <v-row>
                      <v-col cols="6">
                        <v-sheet class="info-box" rounded="lg">
                          <p class="text-caption text-grey-lighten-1">아이템 레벨</p>

                          <strong class="text-h6">
                            {{ searchedProfile.itemAvgLevel }}
                          </strong>
                        </v-sheet>
                      </v-col>

                      <v-col cols="6">
                        <v-sheet class="info-box" rounded="lg">
                          <p class="text-caption text-grey-lighten-1">원정대 레벨</p>

                          <strong class="text-h6">
                            {{ searchedProfile.expeditionLevel }}
                          </strong>
                        </v-sheet>
                      </v-col>

                      <v-col cols="6">
                        <v-sheet class="info-box" rounded="lg">
                          <p class="text-caption text-grey-lighten-1">길드</p>

                          <strong>
                            {{ searchedProfile.guildName || '-' }}
                          </strong>
                        </v-sheet>
                      </v-col>

                      <v-col cols="6">
                        <v-sheet class="info-box" rounded="lg">
                          <p class="text-caption text-grey-lighten-1">영지</p>

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
              <v-card-title class="d-flex align-center justify-space-between">
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
  </v-app>
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
  background: rgba(23, 28, 38, 0.94);
  border: 1px solid #263246;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.28);
}

.character-image {
  background: #10131a;
}

.info-box {
  padding: 16px;
  background: rgba(13, 17, 23, 0.92);
  border: 1px solid #263246;
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
</style>
