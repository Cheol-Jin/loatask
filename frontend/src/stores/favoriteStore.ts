import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'loatask.favorites.v1'

// 브라우저 저장값은 사용자가 수정할 수도 있으므로 읽을 때 형식을 확인합니다.
const parseFavorites = (value: string | null): string[] => {
  if (!value) return []
  const parsed: unknown = JSON.parse(value)
  if (!Array.isArray(parsed) || !parsed.every((name) => typeof name === 'string')) {
    throw new Error('Invalid favorites')
  }
  return [...new Set(parsed.map((name: string) => name.trim()).filter(Boolean))]
}

export const useFavoriteStore = defineStore('favorites', () => {
  const names = ref<string[]>([])
  const storageMessage = ref('')

  try {
    names.value = parseFavorites(localStorage.getItem(STORAGE_KEY))
  } catch {
    storageMessage.value = '즐겨찾기를 불러오지 못했습니다. 새로 저장하면 목록이 다시 만들어집니다.'
  }

  const isFavorite = (name: string) => names.value.includes(name.trim())

  const toggle = (name: string) => {
    const normalized = name.trim()
    if (!normalized) return
    const next = isFavorite(normalized)
      ? names.value.filter((saved) => saved !== normalized)
      : [...names.value, normalized]

    // 저장에 실패하면 기존 목록을 유지하여 저장된 것처럼 보이지 않게 합니다.
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      names.value = next
      storageMessage.value = ''
    } catch {
      storageMessage.value =
        '즐겨찾기를 저장하지 못했습니다. 브라우저의 저장 공간 설정을 확인해 주세요.'
    }
  }

  return { names, storageMessage, isFavorite, toggle }
})
