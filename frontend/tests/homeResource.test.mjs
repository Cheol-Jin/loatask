import { readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import ts from 'typescript'
const src = await readFile(new URL('../src/utils/homeResource.ts', import.meta.url), 'utf8')
const js = ts
  .transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  })
  .outputText.replace("from 'vue'", `from '${import.meta.resolve('vue')}'`)
const { createHomeResource } = await import(
  `data:text/javascript;base64,${Buffer.from(js).toString('base64')}`
)
const key = 'news'
function setup(overrides = {}, cache = null) {
  let time = 10_000_000
  const saved = new Map(cache === null ? [] : [[key, cache]])
  const options = {
    key,
    now: () => time,
    storage: () => ({ getItem: (k) => saved.get(k) ?? null, setItem: (k, v) => saved.set(k, v) }),
    valid: (data) => Array.isArray(data) && data.every((x) => typeof x === 'string'),
    fetch: async () => ['new'],
    retryable: (e) => e.message === 'temporary',
    wait: async () => {},
    ...overrides,
  }
  return {
    resource: createHomeResource(options),
    saved,
    options,
    time,
    setTime: (t) => {
      time = t
    },
  }
}
const cache = (age, data = ['saved']) => JSON.stringify({ savedAt: 10_000_000 - age, data })
test('신선한 캐시는 즉시 복원하고 새로고침 뒤에도 요청을 생략한다', async () => {
  let calls = 0
  const s = setup(
    {
      fetch: async () => {
        calls++
        return ['network']
      },
    },
    cache(1_000),
  )
  assert.deepEqual(s.resource.data.value, ['saved'])
  await s.resource.load()
  assert.equal(calls, 0)
})
test('10분 지난 캐시는 갱신 대기 중에도 보여주고 성공 후 교체한다', async () => {
  let resolve
  const s = setup(
    {
      fetch: () =>
        new Promise((done) => {
          resolve = done
        }),
    },
    cache(10 * 60_000),
  )
  const p = s.resource.load()
  assert.deepEqual(s.resource.data.value, ['saved'])
  assert.equal(s.resource.loading.value, true)
  resolve(['updated'])
  await p
  assert.deepEqual(s.resource.data.value, ['updated'])
  assert.equal(JSON.parse(s.saved.get(key)).savedAt, s.time)
})
test('첫 일시 실패는 한 번 재시도해 복구한다', async () => {
  let calls = 0
  const s = setup({
    fetch: async () => {
      if (++calls === 1) throw new Error('temporary')
      return ['recovered']
    },
  })
  await s.resource.load()
  assert.equal(calls, 2)
  assert.deepEqual(s.resource.data.value, ['recovered'])
  assert.equal(s.resource.error.value, false)
})
test('재시도 실패도 이전 응답을 보존하고 무한 재시도하지 않는다', async () => {
  let calls = 0
  const s = setup(
    {
      fetch: async () => {
        calls++
        throw new Error('temporary')
      },
    },
    cache(11 * 60_000),
  )
  await s.resource.load()
  assert.equal(calls, 2)
  assert.equal(s.resource.error.value, true)
  assert.deepEqual(s.resource.data.value, ['saved'])
})
test('인증 등 재시도 불가 오류와 잘못된 성공 응답은 반복하지 않는다', async () => {
  for (const fetch of [
    async () => {
      throw new Error('unauthorized')
    },
    async () => [null],
  ]) {
    let calls = 0
    const s = setup({
      fetch: async () => {
        calls++
        return fetch()
      },
    })
    await s.resource.load()
    assert.equal(calls, 1)
    assert.equal(s.resource.error.value, true)
    assert.equal(s.resource.hasData.value, false)
  }
})
test('중복 로딩과 수동 재시도는 한 요청을 공유한다', async () => {
  let calls = 0,
    resolve
  const s = setup({
    fetch: () => {
      calls++
      return new Promise((done) => {
        resolve = done
      })
    },
  })
  const first = s.resource.load(),
    second = s.resource.load(true)
  assert.equal(calls, 1)
  resolve(['one'])
  await Promise.all([first, second])
  assert.deepEqual(s.resource.data.value, ['one'])
})
test('24시간 경계·미래 시각·손상 캐시는 사용하지 않는다', async () => {
  for (const value of [cache(24 * 60 * 60_000), cache(-1), cache(1, [null]), '{broken']) {
    const s = setup(
      {
        fetch: async () => {
          throw new Error('unavailable')
        },
      },
      value,
    )
    await s.resource.load()
    assert.equal(s.resource.hasData.value, false)
    assert.deepEqual(s.resource.data.value, [])
  }
})
test('오래 열린 화면도 홈 재진입 시 만료 데이터를 폐기한다', async () => {
  let fail = false
  const s = setup({
    fetch: async () => {
      if (fail) throw new Error('unavailable')
      return ['first']
    },
  })
  await s.resource.load()
  fail = true
  s.setTime(s.time + 24 * 60 * 60_000)
  await s.resource.load()
  assert.equal(s.resource.hasData.value, false)
})
test('빈 성공도 캐시하고 저장소 차단은 응답 표시를 막지 않는다', async () => {
  const s = setup({
    fetch: async () => [],
    storage: () => {
      throw new Error('blocked')
    },
  })
  await s.resource.load()
  assert.equal(s.resource.hasData.value, true)
  assert.equal(s.resource.error.value, false)
})
test('공지와 이벤트의 실패 및 캐시는 독립적이다', async () => {
  const notices = setup({
    fetch: async () => {
      throw new Error('unavailable')
    },
  })
  const events = setup()
  await Promise.all([notices.resource.load(), events.resource.load()])
  assert.equal(notices.resource.error.value, true)
  assert.equal(events.resource.error.value, false)
  assert.deepEqual(events.resource.data.value, ['new'])
})

test('공용 캐시를 받아도 원래 확인 시각을 연장하지 않는다', async () => {
  const original = 10_000_000 - 4 * 60 * 60_000
  const s = setup({ fetch: async () => ({ data: ['maintenance snapshot'], updatedAt: original }) })
  await s.resource.load()
  assert.equal(s.resource.savedAt.value, original)
  assert.equal(JSON.parse(s.saved.get(key)).savedAt, original)
})
test('응답 자체가 24시간을 넘었으면 새로운 성공으로 저장하지 않는다', async () => {
  const s = setup({
    fetch: async () => ({ data: ['expired'], updatedAt: 10_000_000 - 24 * 60 * 60_000 }),
  })
  await s.resource.load()
  assert.equal(s.resource.error.value, true)
  assert.equal(s.resource.hasData.value, false)
})
