import { readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { test, afterEach } from 'node:test'
import ts from 'typescript'
import { createPinia, setActivePinia } from 'pinia'

const source = await readFile(new URL('../src/stores/characterStore.ts', import.meta.url), 'utf8')
const stub = `export const getCharacterErrorMessage = e => e.message;
export const getCharacterProfile = (...args) => globalThis.characterApi.profile(...args);
export const prepareCharacterSearch = (...args) => globalThis.characterApi.prepare(...args);
export const getCharacters = async () => [];`
const stubUrl = `data:text/javascript;base64,${Buffer.from(stub).toString('base64')}`
const compiled = ts
  .transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  })
  .outputText.replace(/from '(vue|pinia)'/g, (_, name) => `from '${import.meta.resolve(name)}'`)
  .replace("from '@/api/lostarkApi'", `from '${stubUrl}'`)
const { useCharacterStore } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`
)
let store
afterEach(() => {
  store?.clearSearch()
  delete globalThis.characterApi
})
function setup(api = {}) {
  globalThis.characterApi = {
    prepare: async () => {},
    profile: async (name) => ({ characterName: name }),
    ...api,
  }
  setActivePinia(createPinia())
  store = useCharacterStore()
  return store
}
function deferred() {
  let resolve, reject
  const promise = new Promise((yes, no) => {
    resolve = yes
    reject = no
  })
  return { promise, resolve, reject }
}

test('서버 준비가 끝난 뒤에만 이다 프로필을 요청한다', async () => {
  const waiting = deferred()
  let called = false
  const store = setup({
    prepare: () => waiting.promise,
    profile: async (name) => {
      called = true
      return { characterName: name }
    },
  })
  const pending = store.searchCharacter('이다')
  assert.equal(store.searchPhase, 'connecting')
  assert.equal(called, false)
  waiting.resolve()
  assert.equal(await pending, true)
  assert.equal(store.searchedProfile.characterName, '이다')
  assert.equal(store.isSearching, false)
})
test('다른 검색은 이전 요청을 취소하고 늦은 응답은 무시한다', async () => {
  const first = deferred()
  let firstSignal
  const store = setup({
    profile: (name, { signal }) => {
      if (name === '이전') {
        firstSignal = signal
        return first.promise
      }
      return { characterName: name }
    },
  })
  const old = store.searchCharacter('이전')
  await Promise.resolve()
  assert.equal(await store.searchCharacter('이다'), true)
  assert.equal(firstSignal.aborted, true)
  first.resolve({ characterName: '이전' })
  assert.equal(await old, false)
  assert.equal(store.searchedProfile.characterName, '이다')
  assert.equal(store.isSearching, false)
})
test('준비 중 취소하면 즉시 로딩을 끝내고 프로필 요청을 막는다', async () => {
  const waiting = deferred()
  let called = false,
    signal
  const store = setup({
    prepare: (s) => {
      signal = s
      return waiting.promise
    },
    profile: async () => {
      called = true
    },
  })
  const pending = store.searchCharacter('이다')
  store.cancelSearch()
  assert.equal(signal.aborted, true)
  assert.equal(store.isSearching, false)
  waiting.resolve()
  assert.equal(await pending, false)
  assert.equal(called, false)
  assert.match(store.errorMessage, /취소/)
})
test('준비 실패와 프로필 실패 모두 로딩을 끝내고 재검색할 수 있다', async () => {
  for (const stage of ['prepare', 'profile']) {
    const store = setup({
      [stage]: async () => {
        throw new Error('서버 응답 지연')
      },
    })
    assert.equal(await store.searchCharacter('이다'), false)
    assert.equal(store.isSearching, false)
    assert.equal(store.errorMessage, '서버 응답 지연')
    globalThis.characterApi[stage] =
      stage === 'prepare' ? async () => {} : async (name) => ({ characterName: name })
    assert.equal(await store.searchCharacter('이다'), true)
  }
})
