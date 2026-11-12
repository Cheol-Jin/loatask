import { defineStore } from 'pinia'
import { ref } from 'vue'
const KEY = 'loatask.recent-searches.v1'
export const useRecentSearchStore = defineStore('recent-searches', () => {
  const names = ref<string[]>([])
  const storageMessage = ref('')
  function load() {
    try {
      const value: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]')
      if (!Array.isArray(value) || value.some((name) => typeof name !== 'string'))
        throw new Error('Invalid recent searches')
      names.value = [...new Set(value.map((name: string) => name.trim()).filter(Boolean))].slice(
        0,
        5,
      )
      storageMessage.value = ''
    } catch {
      storageMessage.value = '최근 검색 기록을 읽지 못했습니다.'
    }
  }
  function remember(name: string) {
    if (!name.trim()) return
    load()
    const next = [name.trim(), ...names.value.filter((item) => item !== name.trim())].slice(0, 5)
    try {
      localStorage.setItem(KEY, JSON.stringify(next))
      names.value = next
      storageMessage.value = ''
    } catch {
      storageMessage.value = '최근 검색 기록을 저장하지 못했습니다.'
    }
  }
  load()
  return { names, storageMessage, remember }
})
