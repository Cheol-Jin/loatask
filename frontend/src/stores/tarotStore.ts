import { defineStore } from 'pinia'
import { ref } from 'vue'
import { migrateTarotReading, validTarotReading, type TarotReading } from '@/data/tarot'
const KEY = 'loatask.neria-tarot.v1'
export const useTarotStore = defineStore('neria-tarot', () => {
  const lastReading = ref<TarotReading | null>(null)
  const storageMessage = ref('')
  function restore() {
    try {
      const raw = localStorage.getItem(KEY)
      if (!raw) return
      const value: unknown = JSON.parse(raw)
      const restored = migrateTarotReading(value)
      if (!restored) throw new Error('Invalid tarot record')
      lastReading.value = restored
      if ((value as TarotReading).cards.length !== restored.cards.length)
        storageMessage.value =
          '이전 상담은 바뀐 배열에 맞춰 핵심 세 장으로 보여드립니다. 기존 저장 원본은 유지됩니다.'
    } catch {
      storageMessage.value = '이전 상담을 불러오지 못했습니다. 새 상담은 계속 이용할 수 있습니다.'
    }
  }
  function save(reading: TarotReading) {
    if (!validTarotReading(reading)) throw new Error('상담 결과를 확인해 주세요.')
    lastReading.value = { ...reading, cards: reading.cards.map((card) => ({ ...card })) }
    try {
      localStorage.setItem(KEY, JSON.stringify(reading))
      storageMessage.value = ''
    } catch {
      storageMessage.value = '상담 결과를 저장하지 못했습니다. 현재 화면에서는 계속 볼 수 있습니다.'
    }
  }
  restore()
  return { lastReading, storageMessage, save }
})
