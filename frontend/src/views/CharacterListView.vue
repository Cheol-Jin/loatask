<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCharacterStore } from '@/stores/characterStore'

const characterStore = useCharacterStore()
const { characters, isLoading, errorMessage } = storeToRefs(characterStore)

onMounted(() => {
  characterStore.fetchCharacters()
})
</script>

<template>
  <v-app>
    <v-main class="page">
      <v-container>
        <v-row class="mb-8">
          <v-col cols="12">
            <p class="text-caption text-blue-lighten-2 mb-2">Lost Ark Character Dashboard</p>

            <h1 class="text-h3 font-weight-bold mb-3">LoaTask</h1>

            <p class="text-body-1 text-grey-lighten-1">
              저장된 로스트아크 캐릭터 정보를 한눈에 확인합니다.
            </p>
          </v-col>
        </v-row>

        <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-6">
          {{ errorMessage }}
        </v-alert>

        <v-row v-if="isLoading">
          <v-col v-for="index in 3" :key="index" cols="12" md="4">
            <v-skeleton-loader type="card" />
          </v-col>
        </v-row>

        <v-row v-else-if="characters.length === 0">
          <v-col cols="12">
            <v-card rounded="xl" class="empty-card">
              <v-card-text class="text-center py-10">
                <v-icon size="48" color="blue-lighten-2" class="mb-4"> mdi-account-search </v-icon>

                <h2 class="text-h6 mb-2">저장된 캐릭터가 없습니다.</h2>

                <p class="text-body-2 text-grey-lighten-1">
                  백엔드 API를 통해 캐릭터를 먼저 저장하면 이곳에 표시됩니다.
                </p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row v-else>
          <v-col v-for="character in characters" :key="character.id" cols="12" sm="6" md="4">
            <v-card rounded="xl" elevation="8" class="character-card">
              <v-img :src="character.characterImage" height="260" cover />

              <v-card-title>
                {{ character.characterName }}
              </v-card-title>

              <v-card-subtitle>
                {{ character.serverName }} · {{ character.jobName }}
              </v-card-subtitle>

              <v-card-text>
                <v-row dense>
                  <v-col cols="6">
                    <v-sheet class="info-box" rounded="lg">
                      <p class="text-caption text-grey">Item Level</p>

                      <strong>{{ character.itemLevel }}</strong>
                    </v-sheet>
                  </v-col>

                  <v-col cols="6">
                    <v-sheet class="info-box" rounded="lg">
                      <p class="text-caption text-grey">Expedition</p>

                      <strong>{{ character.expeditionLevel }}</strong>
                    </v-sheet>
                  </v-col>
                </v-row>
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
  background: #10131a;
}

.character-card {
  background: #171c26;
  border: 1px solid #2a3140;
}

.empty-card {
  background: #171c26;
  border: 1px solid #2a3140;
}

.info-box {
  padding: 12px;
  background: #10131a;
}
</style>
