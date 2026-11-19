import { readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import ts from 'typescript'

const source = await readFile(new URL('../src/utils/backendReadiness.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText
const { waitForBackend, BackendStartupError } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`
)
const ready = () => Response.json({ game: 'Lost Ark', serverStatus: 'OK' })
const options = (fetcher, extra = {}) => ({
  signal: new AbortController().signal,
  fetcher,
  timeoutMs: 300,
  attemptMs: 20,
  retryMs: 1,
  ...extra,
})
// Node의 timeout 신호는 이벤트 루프를 유지하지 않아 테스트 동안만 유지합니다.
async function alive(run) {
  const timer = setInterval(() => {}, 1000)
  try {
    return await run()
  } finally {
    clearInterval(timer)
  }
}
function untilAbort(signal) {
  signal.throwIfAborted()
  return new Promise((_, reject) =>
    signal.addEventListener('abort', () => reject(signal.reason), { once: true }),
  )
}

test('정상 상태 응답이면 즉시 완료한다', async () => {
  let calls = 0
  await waitForBackend(
    '/status',
    options(async () => {
      calls++
      return ready()
    }),
  )
  assert.equal(calls, 1)
})
test('기동 중 HTML·503·다른 앱의 200에서는 검색을 시작하지 않는다', async () => {
  const responses = [
    new Response('<html>starting</html>'),
    new Response('', { status: 503 }),
    Response.json({ serverStatus: 'OK' }),
    ready(),
  ]
  let calls = 0
  await waitForBackend(
    '/status',
    options(async () => responses[calls++]),
  )
  assert.equal(calls, 4)
})
test('개별 요청 시간 초과 후 준비 확인을 재시도한다', () =>
  alive(async () => {
    let calls = 0
    await waitForBackend(
      '/status',
      options(async (_, { signal }) => (++calls === 1 ? untilAbort(signal) : ready())),
    )
    assert.equal(calls, 2)
  }))
test('전체 대기 상한에 도달하면 안전한 안내로 종료한다', () =>
  alive(async () => {
    await assert.rejects(
      waitForBackend(
        '/status',
        options((_, { signal }) => untilAbort(signal), { timeoutMs: 30 }),
      ),
      (error) => error instanceof BackendStartupError && error.message.includes('초과'),
    )
  }))
test('요청 중과 재시도 대기 중 모두 즉시 취소한다', async () => {
  for (const duringFetch of [true, false]) {
    const controller = new AbortController()
    let calls = 0
    const pending = waitForBackend(
      '/status',
      options(
        async (_, { signal }) => {
          calls++
          if (duringFetch) return untilAbort(signal)
          return new Response('', { status: 503 })
        },
        { signal: controller.signal, retryMs: 1000 },
      ),
    )
    await new Promise((resolve) => setTimeout(resolve, 5))
    controller.abort()
    await assert.rejects(pending, { name: 'AbortError' })
    assert.equal(calls, 1)
  }
})
test('연결 대상의 404는 재시도 없이 설정 오류로 안내한다', async () => {
  let calls = 0
  await assert.rejects(
    waitForBackend(
      '/status',
      options(async () => {
        calls++
        return new Response('', { status: 404 })
      }),
    ),
    BackendStartupError,
  )
  assert.equal(calls, 1)
})
