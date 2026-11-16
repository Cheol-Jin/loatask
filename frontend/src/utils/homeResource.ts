import { ref } from 'vue'

const FRESH_MS = 10 * 60_000
const MAX_AGE_MS = 60 * 60_000
interface StorageAccess {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}
interface ResourceOptions<T> {
  key: string
  fetch: () => Promise<T[]>
  valid: (value: unknown) => value is T[]
  retryable: (error: unknown) => boolean
  storage?: () => StorageAccess
  now?: () => number
  wait?: () => Promise<void>
}

// 메모리 상태는 홈을 떠나도 유지하고, 성공한 공개 소식만 브라우저에 저장합니다.
export function createHomeResource<T>(options: ResourceOptions<T>) {
  const data = ref<T[]>([])
  const hasData = ref(false)
  const loading = ref(false)
  const error = ref(false)
  const savedAt = ref(0)
  const now = options.now ?? Date.now
  const storage = options.storage ?? (() => localStorage)
  const wait = options.wait ?? (() => new Promise<void>((resolve) => setTimeout(resolve, 3_000)))
  let pending: Promise<void> | undefined

  function restore() {
    try {
      const cached = JSON.parse(storage().getItem(options.key) ?? 'null')
      if (
        cached &&
        typeof cached.savedAt === 'number' &&
        Number.isFinite(cached.savedAt) &&
        cached.savedAt <= now() &&
        now() - cached.savedAt < MAX_AGE_MS &&
        options.valid(cached.data) &&
        (!hasData.value || cached.savedAt > savedAt.value)
      ) {
        data.value = cached.data
        savedAt.value = cached.savedAt
        hasData.value = true
      }
    } catch {
      // 저장소 차단·손상은 네트워크 조회를 막지 않습니다.
    }
    if (hasData.value && (now() < savedAt.value || now() - savedAt.value >= MAX_AGE_MS)) {
      data.value = []
      savedAt.value = 0
      hasData.value = false
    }
  }

  async function refresh() {
    loading.value = true
    error.value = false
    try {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const next = await options.fetch()
          if (!options.valid(next)) throw new Error('Invalid home news')
          data.value = next
          hasData.value = true
          savedAt.value = now()
          try {
            storage().setItem(options.key, JSON.stringify({ savedAt: savedAt.value, data: next }))
          } catch {
            // 저장에 실패해도 이번 응답은 표시합니다.
          }
          return
        } catch (cause) {
          if (attempt === 1 || !options.retryable(cause)) throw cause
          await wait()
        }
      }
    } catch {
      // 유효한 이전 응답은 지우지 않고 갱신 실패를 함께 표시합니다.
      restore()
      error.value = true
    } finally {
      loading.value = false
    }
  }

  function load(force = false): Promise<void> {
    restore()
    if (pending) return pending
    if (!force && hasData.value && now() - savedAt.value < FRESH_MS) return Promise.resolve()
    pending = refresh().finally(() => {
      pending = undefined
    })
    return pending
  }
  restore()
  return { data, hasData, loading, error, savedAt, load }
}
