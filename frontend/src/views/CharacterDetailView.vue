<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getCharacterErrorMessage, getCharacterProfile } from '@/api/lostarkApi'
import type { LostArkProfile } from '@/types/lostark'

const route = useRoute()

const profile = ref<LostArkProfile | null>(null)

const loading = ref(false)
const errorMessage = ref('')
let requestId = 0

const loadCharacter = async () => {
  const currentRequestId = ++requestId
  const name = typeof route.params.name === 'string' ? route.params.name : ''

  loading.value = true
  profile.value = null
  errorMessage.value = ''

  try {
    const result = await getCharacterProfile(name)
    if (currentRequestId === requestId) profile.value = result
  } catch (error) {
    if (currentRequestId === requestId) errorMessage.value = getCharacterErrorMessage(error)
  } finally {
    if (currentRequestId === requestId) loading.value = false
  }
}

watch(() => route.params.name, loadCharacter, { immediate: true })
</script>

<template>
  <v-main class="page">
    <v-container class="py-10">
      <v-card v-if="loading" rounded="xl" class="detail-card" aria-label="캐릭터 정보 조회 중">
        <v-skeleton-loader type="image, article" />
      </v-card>

      <v-alert v-else-if="errorMessage" type="error" variant="tonal" rounded="xl">
        {{ errorMessage }}
        <div class="mt-4 d-flex ga-3 flex-wrap">
          <v-btn variant="outlined" @click="loadCharacter">다시 시도</v-btn>
          <v-btn variant="text" :to="{ name: 'characterSearch' }">검색 화면으로</v-btn>
        </div>
      </v-alert>

      <v-card v-else-if="profile" rounded="xl" class="detail-card">
        <v-card-text class="pa-10">
          <v-row>
            <v-col cols="12" md="4">
              <v-img :src="profile.characterImage" height="400" cover rounded="xl" />
            </v-col>

            <v-col cols="12" md="8">
              <h1 class="text-h3 font-weight-bold">
                {{ profile.characterName }}
              </h1>

              <v-chip class="mt-3" color="blue">
                {{ profile.characterClassName }}
              </v-chip>

              <v-divider class="my-6" />

              <v-row>
                <v-col cols="6">
                  서버
                  <strong>
                    {{ profile.serverName }}
                  </strong>
                </v-col>

                <v-col cols="6">
                  아이템 레벨
                  <strong>
                    {{ profile.itemAvgLevel }}
                  </strong>
                </v-col>

                <v-col cols="6">
                  원정대 레벨
                  <strong>
                    {{ profile.expeditionLevel }}
                  </strong>
                </v-col>

                <v-col cols="6">
                  길드
                  <strong>
                    {{ profile.guildName || '-' }}
                  </strong>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
  </v-main>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #0d1117;
}

.detail-card {
  background: rgba(23, 28, 38, 0.94);
  border: 1px solid #263246;
}
</style>
