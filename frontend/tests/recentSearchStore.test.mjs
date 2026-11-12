import { readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { test, afterEach } from 'node:test'
import ts from 'typescript'
import { createPinia, setActivePinia } from 'pinia'

// 별도 테스트 라이브러리 없이 실제 TypeScript 스토어를 Node에서 실행합니다.
const source = await readFile(
  new URL('../src/stores/recentSearchStore.ts', import.meta.url),
  'utf8',
)
const compiled = ts
  .transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  })
  .outputText.replace(/from '(vue|pinia)'/g, (_, name) => `from '${import.meta.resolve(name)}'`)
const { useRecentSearchStore } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`
)
const key = 'loatask.recent-searches.v1'
const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
afterEach(() => {
  if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage)
  else delete globalThis.localStorage
})

function setup(value = null, { readFails = false, writeFails = false } = {}) {
  const saved = new Map(value === null ? [] : [[key, value]])
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem(name) {
        if (readFails) throw new Error('Blocked')
        return saved.get(name) ?? null
      },
      setItem(name, data) {
        if (writeFails) throw new Error('Quota exceeded')
        saved.set(name, data)
      },
    },
  })
  setActivePinia(createPinia())
  return { store: useRecentSearchStore(), saved }
}

test('성공한 검색을 최근 순으로 5개만 보관하고 중복을 앞으로 옮긴다', () => {
  const { store, saved } = setup()
  for (const name of ['A', 'B', 'C', 'D', 'E', 'F']) store.remember(name)
  store.remember(' C ')
  assert.deepEqual(store.names, ['C', 'F', 'E', 'D', 'B'])
  setActivePinia(createPinia())
  assert.deepEqual(useRecentSearchStore().names, JSON.parse(saved.get(key)))
})
test('빈 이름과 저장 실패는 기존 기록을 바꾸지 않는다', () => {
  const { store, saved } = setup('["A"]', { writeFails: true })
  store.remember(' ')
  store.remember('B')
  assert.deepEqual(store.names, ['A'])
  assert.equal(saved.get(key), '["A"]')
  assert.ok(store.storageMessage)
})
test('손상된 기록은 안내하고 다음 성공 검색에서 복구한다', () => {
  const { store } = setup('{}')
  assert.ok(store.storageMessage)
  store.remember('A')
  assert.deepEqual(store.names, ['A'])
  assert.equal(store.storageMessage, '')
})
