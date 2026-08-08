import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCharacters } from '@/api/lostarkApi'
import type { LostArkCharacter } from '@/types/lostark'

export const useCharacterStore = defineStore('character', () => {
  const characters = ref<LostArkCharacter[]>([])
  const isLoading = ref(false)
  const errorMessage = ref('')

  const fetchCharacters = async () => {
    try {
      isLoading.value = true
      errorMessage.value = ''
      characters.value = await getCharacters()
    } catch (error) {
      console.error(error)
      errorMessage.value = '캐릭터 목록을 불러오지 못했습니다.'
    } finally {
      isLoading.value = false
    }
  }

  return {
    characters,
    isLoading,
    errorMessage,
    fetchCharacters,
  }
})
