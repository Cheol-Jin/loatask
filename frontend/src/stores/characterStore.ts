import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCharacterProfile, getCharacters } from '@/api/lostarkApi'
import type { LostArkCharacter, LostArkProfile } from '@/types/lostark'

export const useCharacterStore = defineStore('character', () => {
  const characters = ref<LostArkCharacter[]>([])
  const searchedProfile = ref<LostArkProfile | null>(null)

  const isLoading = ref(false)
  const isSearching = ref(false)
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

  const searchCharacter = async (characterName: string) => {
    if (!characterName.trim()) {
      errorMessage.value = '캐릭터명을 입력해주세요.'
      return
    }

    try {
      isSearching.value = true
      errorMessage.value = ''
      searchedProfile.value = null

      searchedProfile.value = await getCharacterProfile(characterName)
    } catch (error) {
      console.error(error)
      errorMessage.value = '캐릭터 정보를 불러오지 못했습니다.'
    } finally {
      isSearching.value = false
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
