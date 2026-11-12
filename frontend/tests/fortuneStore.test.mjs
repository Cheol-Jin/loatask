import { readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { test, afterEach } from 'node:test'
import ts from 'typescript'
import { createPinia, setActivePinia } from 'pinia'

function compile(source) {
  return ts
    .transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    })
    .outputText.replace(/from '(vue|pinia)'/g, (_, name) => `from '${import.meta.resolve(name)}'`)
}
const asUrl = (text) => `data:text/javascript;base64,${Buffer.from(text).toString('base64')}`
const dataUrl = asUrl(
  compile(await readFile(new URL('../src/data/fortune.ts', import.meta.url), 'utf8')),
)
const source = compile(
  await readFile(new URL('../src/stores/fortuneStore.ts', import.meta.url), 'utf8'),
).replace("from '@/data/fortune'", `from '${dataUrl}'`)
const { useFortuneStore, fortuneDay } = await import(asUrl(source))
const { fortuneCards } = await import(dataUrl)
const ids = fortuneCards.slice(0, 3).map((card) => card.id)
const key = 'loatask.fortune.v1'
const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
afterEach(() => {
  if (original) Object.defineProperty(globalThis, 'localStorage', original)
  else delete globalThis.localStorage
})
function setup(value = null, { readFails = false, writeFails = false } = {}) {
  const saved = new Map(value === null ? [] : [[key, value]])
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem(name) {
        if (readFails) throw new Error('blocked')
        return saved.get(name) ?? null
      },
      setItem(name, value) {
        if (writeFails) throw new Error('full')
        saved.set(name, value)
      },
    },
  })
  setActivePinia(createPinia())
  return { store: useFortuneStore(), saved }
}

test('항목별로 하루 2회 제한하며 세 항목은 독립적이다', async () => {
  const { store } = setup()
  for (const topic of ['adventure', 'raid', 'expedition']) {
    assert.equal(store.remaining(topic), 2)
    assert.equal(await store.consume(topic, ids[0]), true)
    assert.equal(await store.consume(topic, ids[1]), true)
    assert.equal(await store.consume(topic, ids[2]), false)
    assert.equal(store.remaining(topic), 0)
    assert.equal(store.lastCardId(topic), ids[1])
  }
})

test('새 Pinia 인스턴스에서도 횟수와 마지막 결과를 복원한다', async () => {
  const { store } = setup()
  await store.consume('raid', ids[0])
  setActivePinia(createPinia())
  const restored = useFortuneStore()
  assert.equal(restored.remaining('raid'), 1)
  assert.equal(restored.lastCardId('raid'), ids[0])
  assert.equal(restored.remaining('adventure'), 2)
})

test('한국 자정 직전과 직후를 구분하고 다음 날에만 초기화한다', async () => {
  const before = new Date('2026-11-12T14:59:59Z')
  const after = new Date('2026-11-12T15:00:00Z')
  assert.equal(fortuneDay(before), '2026-11-12')
  assert.equal(fortuneDay(after), '2026-11-13')
  const { store } = setup()
  await store.consume('adventure', ids[0], before)
  await store.consume('adventure', ids[1], before)
  assert.equal(store.remaining('adventure'), 0)
  assert.equal(store.sync(after), true)
  assert.equal(store.remaining('adventure'), 2)
  assert.equal(store.lastCardId('adventure'), null)
  assert.equal(await store.consume('adventure', ids[0], after), true)
})

test('같은 카드와 존재하지 않는 카드는 중복 소비하지 않는다', async () => {
  const { store } = setup()
  assert.equal(await store.consume('adventure', ids[0]), true)
  assert.equal(await store.consume('adventure', ids[0]), false)
  assert.equal(await store.consume('adventure', 'unknown'), false)
  assert.equal(store.remaining('adventure'), 1)
})

test('다른 스토어가 갱신한 기록을 저장 직전에 다시 읽는다', async () => {
  const { store } = setup()
  setActivePinia(createPinia())
  const other = useFortuneStore()
  await store.consume('expedition', ids[0])
  await other.consume('expedition', ids[1])
  assert.equal(await store.consume('expedition', ids[2]), false)
  assert.deepEqual(store.history('expedition'), [ids[0], ids[1]])
})

test('빠른 중복 호출도 두 번을 초과해 저장하지 않는다', async () => {
  const { store } = setup()
  const results = await Promise.all(ids.map((id) => store.consume('adventure', id)))
  assert.equal(results.filter(Boolean).length, 2)
  assert.equal(store.history('adventure').length, 2)
})

test('읽기 차단 시 횟수를 새로 주지 않고 추첨을 차단한다', async () => {
  const { store, saved } = setup(null, { readFails: true })
  assert.ok(store.storageMessage)
  assert.equal(await store.consume('adventure', ids[0]), false)
  assert.equal(saved.size, 0)
})

test('쓰기 실패 시 결과와 횟수를 변경하지 않는다', async () => {
  const { store, saved } = setup(null, { writeFails: true })
  assert.equal(await store.consume('adventure', ids[0]), false)
  assert.equal(store.remaining('adventure'), 2)
  assert.equal(store.lastCardId('adventure'), null)
  assert.equal(saved.size, 0)
  assert.ok(store.storageMessage)
})

for (const value of [
  'broken',
  '{}',
  'null',
  JSON.stringify({
    day: fortuneDay(),
    draws: { adventure: ['unknown'], raid: [], expedition: [] },
  }),
  JSON.stringify({
    day: fortuneDay(),
    draws: { adventure: [ids[0], ids[0]], raid: [], expedition: [] },
  }),
  JSON.stringify({ day: fortuneDay(), draws: { adventure: ids, raid: [], expedition: [] } }),
]) {
  test(`손상된 기록은 초기화하지 않고 안전하게 추첨을 중단한다: ${value}`, async () => {
    const { store, saved } = setup(value)
    assert.equal(await store.consume('raid', ids[0]), false)
    assert.ok(store.storageMessage)
    assert.equal(saved.get(key), value)
  })
}
