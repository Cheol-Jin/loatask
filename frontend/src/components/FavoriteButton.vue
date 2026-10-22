<script setup lang="ts">
import { useFavoriteStore } from '@/stores/favoriteStore'

defineProps<{ characterName: string }>()
const favorites = useFavoriteStore()
</script>

<template>
  <v-btn
    color="amber"
    variant="tonal"
    rounded="xl"
    :prepend-icon="favorites.isFavorite(characterName) ? 'mdi-star' : 'mdi-star-outline'"
    :aria-pressed="favorites.isFavorite(characterName)"
    @click="favorites.toggle(characterName)"
  >
    {{ favorites.isFavorite(characterName) ? '즐겨찾기 해제' : '즐겨찾기 추가' }}
  </v-btn>
</template>
