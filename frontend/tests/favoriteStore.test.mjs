import { readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { test, afterEach } from 'node:test'
import ts from 'typescript'
import { createPinia, setActivePinia } from 'pinia'

// 별도 테스트 라이브러리 없이 실제 TypeScript 스토어를 Node에서 실행합니다.
const source = await readFile(new URL('../src/stores/favoriteStore.ts', import.meta.url), 'utf8')
const compiled = ts
  .transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  })
  .outputText.replace(/from '(vue|pinia)'/g, (_, name) => `from '${import.meta.resolve(name)}'`)
const { useFavoriteStore } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`
)
const key = 'loatask.favorites.v1'
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
  return { store: useFavoriteStore(), saved }
}

test('추가한 캐릭터가 새 스토어에서도 유지되며 해제도 저장된다', () => {
  const { store, saved } = setup()
  store.toggle(' 대마법사진이 ')
  assert.deepEqual(store.names, ['대마법사진이'])
  assert.equal(store.isFavorite('대마법사진이'), true)
  assert.deepEqual(JSON.parse(saved.get(key)), ['대마법사진이'])
  setActivePinia(createPinia())
  const restored = useFavoriteStore()
  assert.deepEqual(restored.names, ['대마법사진이'])
  restored.toggle('대마법사진이')
  assert.deepEqual(JSON.parse(saved.get(key)), [])
})

test('빈 이름을 무시하고 저장된 중복·공백을 정리한다', () => {
  const { store } = setup('[" 캐릭터 ","캐릭터", ""]')
  assert.deepEqual(store.names, ['캐릭터'])
  store.toggle('  ')
  assert.deepEqual(store.names, ['캐릭터'])
})

for (const invalid of ['broken', '{}', '[123]', '[null]']) {
  test(`손상된 저장값을 안전하게 처리하고 새 저장으로 복구한다: ${invalid}`, () => {
    const { store, saved } = setup(invalid)
    assert.deepEqual(store.names, [])
    assert.ok(store.storageMessage)
    store.toggle('새캐릭터')
    assert.equal(store.storageMessage, '')
    assert.deepEqual(JSON.parse(saved.get(key)), ['새캐릭터'])
  })
}

test('저장 공간 읽기가 차단돼도 화면 상태를 생성한다', () => {
  const { store } = setup(null, { readFails: true })
  assert.deepEqual(store.names, [])
  assert.ok(store.storageMessage)
})

test('저장 실패 시 기존 목록을 유지하며 추가·해제 성공으로 표시하지 않는다', () => {
  const { store, saved } = setup('["기존캐릭터"]', { writeFails: true })
  store.toggle('새캐릭터')
  assert.deepEqual(store.names, ['기존캐릭터'])
  store.toggle('기존캐릭터')
  assert.deepEqual(store.names, ['기존캐릭터'])
  assert.equal(saved.get(key), '["기존캐릭터"]')
  assert.match(store.storageMessage, /저장하지 못했습니다/)
})
