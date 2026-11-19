import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getCharacterErrorMessage,
  getCharacterProfile,
  getCharacters,
  prepareCharacterSearch,
} from '@/api/lostarkApi'
import type { LostArkCharacter, LostArkProfile } from '@/types/lostark'

export const useCharacterStore = defineStore('character', () => {
  const characters = ref<LostArkCharacter[]>([])
  const searchedProfile = ref<LostArkProfile | null>(null)

  const isLoading = ref(false)
  const isSearching = ref(false)
  const errorMessage = ref('')
  const searchPhase = ref<'connecting' | 'profile'>('connecting')
  const elapsedSeconds = ref(0)
  let searchRequestId = 0
  let activeController: AbortController | undefined
  let activeTimer: ReturnType<typeof setInterval> | undefined

  const cancelSearch = (notify = true) => {
    searchRequestId++
    activeController?.abort()
    activeController = undefined
    clearInterval(activeTimer)
    activeTimer = undefined
    isSearching.value = false
    if (notify) errorMessage.value = '검색을 취소했습니다. 다시 검색하실 수 있습니다.'
  }

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
    cancelSearch(false)
    const requestId = searchRequestId
    searchedProfile.value = null
    errorMessage.value = ''
    elapsedSeconds.value = 0

    if (!characterName.trim()) {
      errorMessage.value = '캐릭터명을 입력해 주세요.'
      return false
    }

    const controller = new AbortController()
    activeController = controller
    const startedAt = Date.now()
    activeTimer = setInterval(() => {
      elapsedSeconds.value = Math.floor((Date.now() - startedAt) / 1_000)
    }, 1_000)
    try {
      isSearching.value = true
      searchPhase.value = 'connecting'
      await prepareCharacterSearch(controller.signal)
      if (requestId !== searchRequestId) return false
      searchPhase.value = 'profile'
      const profile = await getCharacterProfile(characterName, { signal: controller.signal })
      if (requestId !== searchRequestId) return false
      searchedProfile.value = profile
      return true
    } catch (error) {
      if (requestId === searchRequestId) errorMessage.value = getCharacterErrorMessage(error)
      return false
    } finally {
      if (requestId === searchRequestId) {
        clearInterval(activeTimer)
        activeTimer = undefined
        activeController = undefined
        isSearching.value = false
      }
    }
  }

  const clearSearch = () => {
    cancelSearch(false)
    searchedProfile.value = null
    errorMessage.value = ''
  }

  return {
    cancelSearch,
    searchPhase,
    elapsedSeconds,
    clearSearch,
    characters,
    searchedProfile,
    isLoading,
    isSearching,
    errorMessage,
    fetchCharacters,
    searchCharacter,
  }
})
