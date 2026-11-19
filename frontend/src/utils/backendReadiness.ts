export class BackendStartupError extends Error {}

type ReadinessOptions = {
  signal: AbortSignal
  timeoutMs?: number
  attemptMs?: number
  retryMs?: number
  fetcher?: typeof fetch
}

function pause(ms: number, signal: AbortSignal): Promise<void> {
  signal.throwIfAborted()
  return new Promise((resolve, reject) => {
    const onAbort = () => {
      clearTimeout(timer)
      reject(signal.reason)
    }
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', onAbort)
      resolve()
    }, ms)
    signal.addEventListener('abort', onAbort, { once: true })
  })
}

// 상태 확인은 DB/검색 통계를 변경하지 않습니다. 절전 해제 후에만 실제 조회합니다.
export async function waitForBackend(
  url: string,
  {
    signal,
    timeoutMs = 180_000,
    attemptMs = 10_000,
    retryMs = 1_500,
    fetcher = fetch,
  }: ReadinessOptions,
): Promise<void> {
  const deadline = AbortSignal.timeout(timeoutMs)
  const waiting = AbortSignal.any([signal, deadline])
  try {
    while (true) {
      waiting.throwIfAborted()
      try {
        const response = await fetcher(url, {
          signal: AbortSignal.any([waiting, AbortSignal.timeout(attemptMs)]),
          cache: 'no-store',
        })
        if ([400, 401, 403, 404].includes(response.status)) {
          throw new BackendStartupError(
            '조회 서버 연결 설정을 확인해 주세요. 잠시 후 다시 검색해 주세요.',
          )
        }
        if (response.ok) {
          const status: unknown = await response.json()
          if (
            typeof status === 'object' &&
            status !== null &&
            'serverStatus' in status &&
            status.serverStatus === 'OK' &&
            'game' in status &&
            status.game === 'Lost Ark'
          )
            return
        }
      } catch (error) {
        if (error instanceof BackendStartupError) throw error
        // 시작 중 HTML/503/네트워크 오류나 개별 요청 TimeoutError는 다시 확인합니다.
        // 사용자 AbortError와 전체 대기 TimeoutError는 아래에서 즉시 종료합니다.
        waiting.throwIfAborted()
      }
      await pause(retryMs, waiting)
    }
  } catch (error) {
    if (signal.aborted) throw signal.reason
    if (deadline.aborted) {
      throw new BackendStartupError(
        '서버 시작 대기 시간이 초과되었습니다. 잠시 후 다시 검색해 주세요.',
        { cause: error },
      )
    }
    throw error
  }
}
