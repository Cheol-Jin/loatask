<script setup lang="ts">
import { ref, watch } from 'vue'
import CharacterProfile from '@/components/CharacterProfile.vue'
import CharacterArmory from '@/components/CharacterArmory.vue'
import CharacterRoster from '@/components/CharacterRoster.vue'
import FavoriteButton from '@/components/FavoriteButton.vue'
import { useFavoriteStore } from '@/stores/favoriteStore'
import { useRoute } from 'vue-router'
import { getCharacterErrorMessage, getCharacterArmory } from '@/api/lostarkApi'
import type { LostArkArmory } from '@/types/lostark'

const route = useRoute()
const favorites = useFavoriteStore()

const armory = ref<LostArkArmory | null>(null)

const loading = ref(false)
const errorMessage = ref('')
let requestId = 0

const loadCharacter = async () => {
  const currentRequestId = ++requestId
  const name = typeof route.params.name === 'string' ? route.params.name : ''

  loading.value = true
  armory.value = null
  errorMessage.value = ''

  try {
    const result = await getCharacterArmory(name)
    if (currentRequestId === requestId) armory.value = result
  } catch (error) {
    if (currentRequestId === requestId) errorMessage.value = getCharacterErrorMessage(error)
  } finally {
    if (currentRequestId === requestId) loading.value = false
  }
}

watch(() => route.params.name, loadCharacter, { immediate: true })
</script>

<template>
  <v-main>
    <v-container class="page-shell detail-shell">
      <RouterLink :to="{ name: 'characterSearch' }" class="back-link">← 캐릭터 검색</RouterLink>
      <p class="detail-label">캐릭터 상세정보</p>
      <v-alert
        v-if="favorites.storageMessage"
        type="warning"
        variant="tonal"
        class="mb-6"
        role="status"
        >{{ favorites.storageMessage }}</v-alert
      >
      <v-skeleton-loader v-if="loading" type="image, article" aria-label="캐릭터 정보 조회 중" />
      <v-alert v-else-if="errorMessage" type="error" variant="tonal">
        {{ errorMessage }}
        <div class="profile-actions">
          <v-btn variant="outlined" @click="loadCharacter">다시 시도</v-btn
          ><v-btn variant="text" :to="{ name: 'characterSearch' }">검색 화면으로</v-btn>
        </div>
      </v-alert>
      <template v-else-if="armory">
        <CharacterProfile :profile="armory.profile" detail>
          <FavoriteButton :character-name="armory.profile.characterName" />
        </CharacterProfile>
        <CharacterRoster
          :character-name="armory.profile.characterName"
          :server-name="armory.profile.serverName"
        />
        <CharacterArmory :armory="armory" />
      </template>
    </v-container>
  </v-main>
</template>

<style scoped>
.detail-shell {
  max-width: 1200px;
}
.back-link {
  display: inline-block;
  margin-bottom: 28px;
  color: var(--muted);
  font-size: 13px;
}
.back-link:hover {
  color: var(--text);
}
.detail-label {
  margin-bottom: 16px;
  font-size: 13px;
  color: var(--muted);
}
</style>
