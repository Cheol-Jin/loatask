import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCharacterErrorMessage, getCharacterProfile, getCharacters } from '@/api/lostarkApi'
import type { LostArkCharacter, LostArkProfile } from '@/types/lostark'

export const useCharacterStore = defineStore('character', () => {
  const characters = ref<LostArkCharacter[]>([])
  const searchedProfile = ref<LostArkProfile | null>(null)

  const isLoading = ref(false)
  const isSearching = ref(false)
  const errorMessage = ref('')
  let searchRequestId = 0

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

  const searchCharacter = async (characterName: string) => {
    const requestId = ++searchRequestId
    searchedProfile.value = null
    errorMessage.value = ''

    if (!characterName.trim()) {
      errorMessage.value = '캐릭터명을 입력해 주세요.'
      isSearching.value = false
      return
    }

    try {
      isSearching.value = true
      const profile = await getCharacterProfile(characterName)
      if (requestId === searchRequestId) searchedProfile.value = profile
    } catch (error) {
      if (requestId === searchRequestId) errorMessage.value = getCharacterErrorMessage(error)
    } finally {
      if (requestId === searchRequestId) isSearching.value = false
    }
  }

  return {
    characters,
    searchedProfile,
    isLoading,
    isSearching,
    errorMessage,
    fetchCharacters,
    searchCharacter,
  }
})
