import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fortuneCards, fortuneTopics, type FortuneTopic } from '@/data/fortune'

const STORAGE_KEY = 'loatask.fortune.v1'
export const DAILY_DRAW_LIMIT = 2
type DailyRecord = { day: string; draws: Record<FortuneTopic, string[]> }

export function fortuneDay(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now)
  const part = (type: string) => parts.find((item) => item.type === type)!.value
  return `${part('year')}-${part('month')}-${part('day')}`
}

function emptyRecord(day: string): DailyRecord {
  return { day, draws: { adventure: [], raid: [], expedition: [] } }
}

function readRecord(day: string): DailyRecord {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (!saved) return emptyRecord(day)
  const parsed = JSON.parse(saved) as Partial<DailyRecord>
  if (
    !parsed ||
    typeof parsed.day !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(parsed.day) ||
    parsed.day > day
  ) {
    throw new Error('Invalid date')
  }
  if (parsed.day !== day) return emptyRecord(day)
  if (!parsed.draws) throw new Error('Invalid draws')
  const ids = new Set(fortuneCards.map((card) => card.id))
  for (const { id } of fortuneTopics) {
    const draws = parsed.draws[id]
    if (
      !Array.isArray(draws) ||
      draws.length > DAILY_DRAW_LIMIT ||
      draws.some((value) => typeof value !== 'string' || !ids.has(value)) ||
      new Set(draws).size !== draws.length
    )
      throw new Error('Invalid history')
  }
  return {
    day,
    draws: {
      adventure: [...parsed.draws.adventure],
      raid: [...parsed.draws.raid],
      expedition: [...parsed.draws.expedition],
    },
  }
}

export const useFortuneStore = defineStore('fortune', () => {
  const record = ref<DailyRecord>(emptyRecord(fortuneDay()))
  const storageMessage = ref('')

  function sync(now = new Date()): boolean {
    try {
      record.value = readRecord(fortuneDay(now))
      storageMessage.value = ''
      return true
    } catch {
      storageMessage.value =
        '운세 사용 기록을 읽지 못했습니다. 브라우저 저장 공간 설정을 확인한 뒤 다시 시도해 주세요.'
      return false
    }
  }

  const history = (topic: FortuneTopic) => record.value.draws[topic]
  const remaining = (topic: FortuneTopic) => DAILY_DRAW_LIMIT - history(topic).length
  const lastCardId = (topic: FortuneTopic) => history(topic).at(-1) ?? null

  async function consume(topic: FortuneTopic, cardId: string, now?: Date): Promise<boolean> {
    function commit(): boolean {
      // 다른 탭에서 사용한 횟수와 자정 경계를 저장 직전에 다시 확인합니다.
      if (
        !sync(now ?? new Date()) ||
        remaining(topic) <= 0 ||
        history(topic).includes(cardId) ||
        !fortuneCards.some((card) => card.id === cardId)
      )
        return false
      const next: DailyRecord = {
        day: record.value.day,
        draws: { ...record.value.draws, [topic]: [...history(topic), cardId] },
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        record.value = next
        storageMessage.value = ''
        return true
      } catch {
        storageMessage.value =
          '운세 결과를 저장하지 못해 횟수를 사용하지 않았습니다. 저장 공간 설정을 확인해 주세요.'
        return false
      }
    }
    // 지원 브라우저에서는 여러 탭의 동시 추첨도 같은 잠금으로 직렬화합니다.
    if (typeof navigator !== 'undefined' && navigator.locks) {
      return navigator.locks.request(STORAGE_KEY, commit)
    }
    return commit()
  }

  sync()
  return { record, storageMessage, sync, history, remaining, lastCardId, consume }
})
