import { readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import ts from 'typescript'

const source = await readFile(new URL('../src/data/fortune.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText
const { fortuneCards, fortuneTopics, shuffleFortuneCards } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`
)

test('12장의 고유한 카드가 모든 주제에 대한 해석을 갖는다', () => {
  assert.equal(fortuneCards.length, 12)
  assert.equal(new Set(fortuneCards.map((card) => card.id)).size, 12)
  assert.equal(fortuneTopics.length, 3)
  for (const card of fortuneCards) {
    assert.ok(card.name && card.message && card.keyword && card.icon)
    for (const topic of fortuneTopics) assert.ok(card.readings[topic.id]?.trim())
  }
})

test('셔플은 원본을 변경하지 않고 중복 없는 카드 전체를 유지한다', () => {
  const original = fortuneCards.map((card) => card.id)
  const shuffled = shuffleFortuneCards(() => 0)
  assert.deepEqual(
    fortuneCards.map((card) => card.id),
    original,
  )
  assert.notDeepEqual(
    shuffled.map((card) => card.id),
    original,
  )
  assert.deepEqual(shuffled.map((card) => card.id).sort(), [...original].sort())
  assert.equal(new Set(shuffled.slice(0, 3).map((card) => card.id)).size, 3)
})

test('난수의 상한 근처에서도 유효한 카드만 나온다', () => {
  const shuffled = shuffleFortuneCards(() => 0.999999)
  assert.equal(shuffled.length, 12)
  assert.ok(shuffled.every((card) => card?.id))
})
