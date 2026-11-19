import { readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import ts from 'typescript'
const compile = (text) =>
  ts.transpileModule(text, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText
const url = (text) => `data:text/javascript;base64,${Buffer.from(text).toString('base64')}`
const dataUrl = url(
  compile(await readFile(new URL('../src/data/tarot.ts', import.meta.url), 'utf8')),
)
const { tarotCards, tarotTopics, tarotSpreads } = await import(dataUrl)
const { summarizeTarotReading } = await import(
  url(
    compile(
      await readFile(new URL('../src/data/tarotConclusion.ts', import.meta.url), 'utf8'),
    ).replace("from '@/data/tarot'", `from '${dataUrl}'`),
  )
)
const reading = (cards = ['magician', 'lovers', 'star']) => ({
  version: 1,
  topicId: 'crush',
  spreadId: 'mind',
  createdAt: '2026-11-19T00:00:00Z',
  cards: cards.map((cardId) => ({ cardId, reversed: false })),
})
test('주제·배열·78장과 모든 정역방향 조합에 종합 결론과 근거를 만든다', () => {
  for (const topic of tarotTopics)
    for (const spread of tarotSpreads)
      for (let mask = 0; mask < 8; mask++) {
        const value = {
          ...reading(),
          topicId: topic.id,
          spreadId: spread.id,
          cards: tarotCards
            .slice(mask, mask + spread.positions.length)
            .map((card, i) => ({ cardId: card.id, reversed: !!(mask & (1 << i)) })),
        }
        const result = summarizeTarotReading(value)
        assert.match(result.message, new RegExp(topic.label))
        assert.equal(result.evidence.length, spread.positions.length)
        assert.ok(result.headline && result.nextStep && result.reasoning)
        assert.doesNotMatch(JSON.stringify(result), /undefined/)
      }
  for (const card of tarotCards)
    assert.ok(summarizeTarotReading({ ...reading([card.id]), spreadId: 'one' }).theme)
})
test('같은 계열의 카드 교체와 순서 변경도 흐름·실천에 반영된다', () => {
  const first = summarizeTarotReading(reading(['wands-ace', 'wands-two', 'star']))
  const changed = summarizeTarotReading(reading(['wands-three', 'wands-two', 'star']))
  assert.notEqual(first.journey, changed.journey)
  const reordered = summarizeTarotReading(reading(['star', 'wands-two', 'wands-ace']))
  assert.notEqual(first.nextStep, reordered.nextStep)
})
test('정역방향은 진행·조정·혼합 흐름으로 구분하고 주제가 행동을 바꾼다', () => {
  const value = reading()
  const forward = summarizeTarotReading(value)
  const reversed = summarizeTarotReading({
    ...value,
    cards: value.cards.map((card) => ({ ...card, reversed: true })),
  })
  const mixed = summarizeTarotReading({
    ...value,
    cards: value.cards.map((card, i) => ({ ...card, reversed: i === 0 })),
  })
  assert.equal(forward.tone, 'forward')
  assert.equal(reversed.tone, 'pause')
  assert.equal(mixed.tone, 'mixed')
  assert.notEqual(forward.headline, reversed.headline)
  assert.notEqual(
    forward.topicAction,
    summarizeTarotReading({ ...value, topicId: 'raid' }).topicAction,
  )
})
test('미완성·중복 상담은 종합 결론을 만들지 않는다', () => {
  assert.throws(() => summarizeTarotReading(reading(['fool'])))
  assert.throws(() => summarizeTarotReading(reading(['fool', 'fool', 'star'])))
})
