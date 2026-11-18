import { readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { test, afterEach } from 'node:test'
import ts from 'typescript'
import { createPinia, setActivePinia } from 'pinia'
const compile = (src) =>
  ts
    .transpileModule(src, {
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    })
    .outputText.replace(/from '(vue|pinia)'/g, (_, name) => `from '${import.meta.resolve(name)}'`)
const asUrl = (text) => `data:text/javascript;base64,${Buffer.from(text).toString('base64')}`
const data = asUrl(
  compile(await readFile(new URL('../src/data/tarot.ts', import.meta.url), 'utf8')),
)
const source = compile(
  await readFile(new URL('../src/stores/tarotStore.ts', import.meta.url), 'utf8'),
).replace("from '@/data/tarot'", `from '${data}'`)
const { useTarotStore } = await import(asUrl(source))
const key = 'loatask.neria-tarot.v1'
const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
afterEach(() => {
  if (original) Object.defineProperty(globalThis, 'localStorage', original)
  else delete globalThis.localStorage
})
const record = () => ({
  version: 1,
  topicId: 'crush',
  spreadId: 'one',
  createdAt: '2026-11-19T00:00:00Z',
  cards: [{ cardId: 'fool', reversed: false }],
})
function setup(value = null, { readFails = false, writeFails = false } = {}) {
  const saved = new Map(value === null ? [] : [[key, value]])
  saved.set('loatask.fortune.v1', 'keep-yom-record')
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (k) => {
        if (readFails) throw new Error('blocked')
        return saved.get(k) ?? null
      },
      setItem: (k, v) => {
        if (writeFails) throw new Error('full')
        saved.set(k, v)
      },
    },
  })
  setActivePinia(createPinia())
  return { store: useTarotStore(), saved }
}
test('상담 저장과 새 스토어 복원은 카드·방향·주제·배열을 유지한다', () => {
  const { store, saved } = setup()
  const reading = record()
  store.save(reading)
  reading.cards[0].reversed = true
  assert.equal(store.lastReading.cards[0].reversed, false)
  setActivePinia(createPinia())
  assert.deepEqual(useTarotStore().lastReading, record())
  assert.equal(saved.get('loatask.fortune.v1'), 'keep-yom-record')
})
test('저장 공간 실패에도 이번 결과를 보여주고 영구 저장 성공이라고 알리지 않는다', () => {
  const { store } = setup(null, { writeFails: true })
  store.save(record())
  assert.deepEqual(store.lastReading, record())
  assert.match(store.storageMessage, /저장하지 못/)
})
test('손상되거나 읽기가 막힌 기록은 안내하고 새 상담을 허용한다', () => {
  for (const value of ['broken', '{}']) {
    const { store } = setup(value)
    assert.equal(store.lastReading, null)
    assert.match(store.storageMessage, /불러오지 못/)
    store.save(record())
    assert.equal(store.storageMessage, '')
  }
  assert.match(setup(null, { readFails: true }).store.storageMessage, /불러오지 못/)
})
test('잘못된 상담은 현재 결과를 덮어쓰지 않는다', () => {
  const { store } = setup()
  store.save(record())
  assert.throws(() => store.save({ ...record(), cards: [] }))
  assert.deepEqual(store.lastReading, record())
})
